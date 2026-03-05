import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    SelectionMode,
    MarkerType,
    useReactFlow,
    ConnectionMode,
    useViewport,
} from 'reactflow';
import { useFlowStore } from '../store';
import { NodeData } from '../lib/types';
import { useFlowOperations } from '../hooks/useFlowOperations';
import { useModifierKeys } from '../hooks/useModifierKeys';
import { useEdgeInteractions } from '../hooks/useEdgeInteractions';
import CustomConnectionLine from './CustomConnectionLine';
import { ConnectMenu } from './ConnectMenu';
import { ContextMenu } from './ContextMenu';
import { NavigationControls } from './NavigationControls';
import { MINIMAP_NODE_COLORS } from '../constants';
import { flowCanvasEdgeTypes, flowCanvasNodeTypes, isDuplicateConnection } from './flow-canvas/flowCanvasTypes';
import { useFlowCanvasMenus } from './flow-canvas/useFlowCanvasMenus';
import { useFlowCanvasDragDrop } from './flow-canvas/useFlowCanvasDragDrop';
import { useFlowCanvasConnectionState } from './flow-canvas/useFlowCanvasConnectionState';
import { useFlowCanvasContextActions } from './flow-canvas/useFlowCanvasContextActions';
import {
    getInteractionLodCooldownMs,
    getSafetyAdjustedEdges,
    isFarZoomReductionActiveForProfile,
    isInteractionLowDetailModeActive,
    isLargeGraphSafetyActive,
    isLowDetailModeActiveForProfile,
    shouldEnableViewportCulling,
} from './flow-canvas/largeGraphSafetyMode';
import { detectMermaidDiagramType } from '@/services/mermaid/detectDiagramType';
import { parseMermaidByType } from '@/services/mermaid/parseMermaidByType';
import { getElkLayout } from '@/services/elkLayout';
import { assignSmartHandles } from '@/services/smartEdgeRouting';
import { createTextNode } from '@/hooks/node-operations/utils';
import { createId } from '@/lib/id';
import { useToast } from './ui/ToastContext';

interface FlowCanvasProps {
    recordHistory: () => void;
    isSelectMode: boolean;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
    recordHistory,
    isSelectMode
}) => {
    const { t } = useTranslation();
    const {
        nodes, edges,
        onNodesChange, onEdgesChange,
        layers,
        activeTabId,
        updateTab,
        setNodes,
        setEdges,
        setSelectedNodeId,
        viewSettings: { showGrid, snapToGrid, showMiniMap, largeGraphSafetyMode, largeGraphSafetyProfile, architectureStrictMode },
    } = useFlowStore();
    const { addToast } = useToast();
    const safetyModeActive = isLargeGraphSafetyActive(nodes.length, edges.length, largeGraphSafetyMode, largeGraphSafetyProfile);
    const viewportCullingEnabled = shouldEnableViewportCulling(safetyModeActive);
    const effectiveShowGrid = showGrid && !safetyModeActive;
    const effectiveShowMiniMap = showMiniMap;
    const layerById = useMemo(
        () => new Map(layers.map((layer) => [layer.id, layer])),
        [layers]
    );
    const layerAdjustedNodes = useMemo(() => nodes.map((node) => {
        const layerId = node.data?.layerId ?? 'default';
        const layer = layerById.get(layerId);
        const isVisible = layer?.visible ?? true;
        const isLocked = layer?.locked ?? false;
        return {
            ...node,
            hidden: !isVisible,
            selected: isVisible ? node.selected : false,
            draggable: !isLocked,
        };
    }), [nodes, layerById]);
    const visibleNodeIds = useMemo(
        () => new Set(layerAdjustedNodes.filter((node) => !node.hidden).map((node) => node.id)),
        [layerAdjustedNodes]
    );
    const visibleEdges = useMemo(
        () => edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)),
        [edges, visibleNodeIds]
    );
    const effectiveEdges = useMemo(() => getSafetyAdjustedEdges(visibleEdges, safetyModeActive), [visibleEdges, safetyModeActive]);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isInteractionCooldown, setIsInteractionCooldown] = useState(false);
    const interactionCooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const { screenToFlowPosition, fitView } = useReactFlow();
    const { zoom } = useViewport();
    const {
        connectMenu,
        setConnectMenu,
        contextMenu,
        onNodeContextMenu,
        onPaneContextMenu,
        onEdgeContextMenu,
        onPaneClick,
        onCloseContextMenu,
    } = useFlowCanvasMenus();

    // --- Operations ---
    const {
        onConnect, onSelectionChange, onNodeDoubleClick,
        onNodeDragStart, onNodeDragStop,
        onConnectStart, onConnectEnd,
        handleAddAndConnect,
        deleteNode, deleteEdge, duplicateNode,
        updateNodeZIndex,
        pasteSelection, copySelection,
        handleAlignNodes, handleDistributeNodes, handleGroupNodes,
        onEdgeUpdate,
        onNodeDrag,
        handleAddImage
    } = useFlowOperations(
        recordHistory,
        (position, sourceId, sourceHandle) => setConnectMenu({ position, sourceId, sourceHandle })
    );

    const { onDragOver, onDrop } = useFlowCanvasDragDrop({
        screenToFlowPosition,
        handleAddImage,
    });

    // --- Keyboard Shortcuts ---
    const { isSelectionModifierPressed } = useModifierKeys();
    useEdgeInteractions();

    useEffect(() => {
        return () => {
            if (interactionCooldownTimeoutRef.current) {
                clearTimeout(interactionCooldownTimeoutRef.current);
            }
        };
    }, []);

    const startInteractionLowDetail = () => {
        if (interactionCooldownTimeoutRef.current) {
            clearTimeout(interactionCooldownTimeoutRef.current);
            interactionCooldownTimeoutRef.current = null;
        }
        setIsInteractionCooldown(false);
        setIsInteracting(true);
    };

    const endInteractionLowDetail = () => {
        setIsInteracting(false);
        setIsInteractionCooldown(true);

        if (interactionCooldownTimeoutRef.current) {
            clearTimeout(interactionCooldownTimeoutRef.current);
        }
        interactionCooldownTimeoutRef.current = setTimeout(() => {
            setIsInteractionCooldown(false);
            interactionCooldownTimeoutRef.current = null;
        }, getInteractionLodCooldownMs(largeGraphSafetyProfile));
    };

    const isEffectiveSelectMode = isSelectMode || isSelectionModifierPressed;
    const lowDetailModeActive = isLowDetailModeActiveForProfile(safetyModeActive, zoom, largeGraphSafetyProfile);
    const interactionLowDetailModeActive = isInteractionLowDetailModeActive(
        safetyModeActive,
        isInteracting || isInteractionCooldown
    );
    const farZoomReductionActive = isFarZoomReductionActiveForProfile(safetyModeActive, zoom, largeGraphSafetyProfile);
    const { isConnecting, onConnectStartWrapper, onConnectEndWrapper } = useFlowCanvasConnectionState({
        onConnectStart: (event, params) => {
            onConnectStart(event as Parameters<typeof onConnectStart>[0], params as Parameters<typeof onConnectStart>[1]);
        },
        onConnectEnd: (event) => {
            onConnectEnd(event as Parameters<typeof onConnectEnd>[0]);
        },
    });
    const contextActions = useFlowCanvasContextActions({
        contextMenu,
        onCloseContextMenu,
        screenToFlowPosition,
        copySelection,
        pasteSelection,
        duplicateNode,
        deleteNode,
        deleteEdge,
        updateNodeZIndex,
        handleAlignNodes,
        handleDistributeNodes,
        handleGroupNodes,
        nodes,
    });

    const getCanvasCenterFlowPosition = (): { x: number; y: number } => {
        if (!reactFlowWrapper.current) {
            return screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        }
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        return screenToFlowPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });
    };

    const isEditablePasteTarget = (target: EventTarget | null): boolean => {
        const element = target instanceof HTMLElement ? target : null;
        if (!element) return false;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return true;
        if (element.isContentEditable) return true;
        return element.closest('[contenteditable="true"]') !== null;
    };

    const handleCanvasPaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
        if (isEditablePasteTarget(event.target)) return;

        const rawText = event.clipboardData.getData('text/plain');
        const pastedText = rawText.trim();

        if (!pastedText) {
            pasteSelection(getCanvasCenterFlowPosition());
            return;
        }

        event.preventDefault();

        const maybeMermaidType = detectMermaidDiagramType(pastedText);
        if (maybeMermaidType) {
            const result = parseMermaidByType(pastedText, { architectureStrictMode });
            if (!result.error) {
                recordHistory();

                if (result.nodes.length > 0) {
                    try {
                        const direction = (result as { metadata?: { direction?: string }; direction?: string }).metadata?.direction
                            || (result as { direction?: string }).direction
                            || 'TB';
                        const layoutDirection: 'TB' | 'LR' | 'RL' | 'BT' =
                            direction === 'LR' || direction === 'RL' || direction === 'BT' || direction === 'TB'
                                ? direction
                                : 'TB';
                        const layoutedNodes = await getElkLayout(result.nodes, result.edges, {
                            direction: layoutDirection,
                            algorithm: 'layered',
                            spacing: 'normal',
                        });
                        const smartEdges = assignSmartHandles(layoutedNodes, result.edges);
                        setNodes(layoutedNodes);
                        setEdges(smartEdges);
                    } catch {
                        setNodes(result.nodes);
                        setEdges(result.edges);
                    }
                } else {
                    setNodes(result.nodes);
                    setEdges(result.edges);
                }

                if ('diagramType' in result && result.diagramType) {
                    updateTab(activeTabId, { diagramType: result.diagramType });
                }

                setTimeout(() => fitView({ duration: 600, padding: 0.2 }), 80);
                return;
            }
            if (maybeMermaidType === 'architecture' && architectureStrictMode) {
                addToast(
                    t(
                        'flowCanvas.strictModePasteBlocked',
                        'Architecture strict mode blocked Mermaid paste. Open Code view, fix diagnostics, then retry.'
                    ),
                    'error'
                );
                return;
            }
        }

        const pasteFlowPosition = getCanvasCenterFlowPosition();

        recordHistory();
        const textNodeId = createId('text');
        const { activeLayerId } = useFlowStore.getState();
        const newTextNode = createTextNode(textNodeId, pasteFlowPosition, pastedText);
        newTextNode.data = {
            ...newTextNode.data,
            layerId: activeLayerId,
        };

        setNodes((existingNodes) => [
            ...existingNodes.map((node) => ({ ...node, selected: false })),
            { ...newTextNode, selected: true },
        ]);
        setSelectedNodeId(textNodeId);
    };

    return (
        <div
            className={`w-full h-full relative ${isConnecting ? 'is-connecting' : ''} ${lowDetailModeActive ? 'flow-lod-low' : ''} ${interactionLowDetailModeActive ? 'flow-lod-interaction' : ''} ${farZoomReductionActive ? 'flow-lod-far' : ''}`}
            ref={reactFlowWrapper}
            onPasteCapture={handleCanvasPaste}
        >
            <ReactFlow
                nodes={layerAdjustedNodes}
                edges={effectiveEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeUpdate={onEdgeUpdate}
                onSelectionChange={onSelectionChange}
                onNodeDragStart={(event, node) => {
                    startInteractionLowDetail();
                    onNodeDragStart(event, node);
                }}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={(event, node) => {
                    onNodeDragStop(event, node);
                    endInteractionLowDetail();
                }}
                onMoveStart={startInteractionLowDetail}
                onMoveEnd={endInteractionLowDetail}
                onNodeDoubleClick={onNodeDoubleClick}
                onNodeContextMenu={onNodeContextMenu}
                onPaneContextMenu={onPaneContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onPaneClick={onPaneClick}

                onConnectStart={onConnectStartWrapper}
                onConnectEnd={onConnectEndWrapper}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={flowCanvasNodeTypes}
                edgeTypes={flowCanvasEdgeTypes}
                fitView
                className="bg-[var(--brand-background)]"
                minZoom={0.1}
                onlyRenderVisibleElements={viewportCullingEnabled}
                connectionMode={ConnectionMode.Loose}
                isValidConnection={(connection) => {
                    return !isDuplicateConnection(connection, effectiveEdges);
                }}
                selectionOnDrag={isEffectiveSelectMode}
                panOnDrag={!isEffectiveSelectMode}
                selectionMode={isEffectiveSelectMode ? SelectionMode.Partial : undefined}
                multiSelectionKeyCode="Alt"
                defaultEdgeOptions={{
                    style: { stroke: '#94a3b8', strokeWidth: 2 },
                    animated: false,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                }}
                connectionLineComponent={CustomConnectionLine}
                snapToGrid={snapToGrid}
            >
                {effectiveShowGrid && <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />}
                <NavigationControls />
                {effectiveShowMiniMap && (
                    <MiniMap
                        nodeColor={(n) => MINIMAP_NODE_COLORS[n.type ?? ''] ?? '#64748b'}
                        maskColor="rgba(241, 245, 249, 0.7)"
                        className="border border-slate-200 shadow-lg rounded-lg overflow-hidden"
                    />
                )}
            </ReactFlow>

            {connectMenu && (
                <ConnectMenu
                    position={connectMenu.position}
                    onClose={() => setConnectMenu(null)}
                    onSelect={(type, shape) => {
                        if (connectMenu) {
                            const flowPos = screenToFlowPosition(connectMenu.position);
                            handleAddAndConnect(type, flowPos, connectMenu.sourceId, connectMenu.sourceHandle, shape as NodeData['shape']);
                        }
                    }}
                />
            )}
            {
                contextMenu.isOpen && (
                    <ContextMenu
                        {...contextMenu}
                        onClose={onCloseContextMenu}
                        onCopy={copySelection}
                        onPaste={contextActions.onPaste}
                        onDuplicate={contextActions.onDuplicate}
                        onDelete={contextActions.onDelete}
                        onSendToBack={contextActions.onSendToBack}
                        canPaste={true}
                        selectedCount={contextActions.selectedCount}
                        onAlignNodes={contextActions.onAlignNodes}
                        onDistributeNodes={contextActions.onDistributeNodes}
                        onGroupSelected={contextActions.onGroupSelected}
                    />
                )
            }
        </div>
    );
};
