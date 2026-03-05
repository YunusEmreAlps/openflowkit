import React from 'react';
import { Node, Edge } from 'reactflow';
import { NodeData } from '@/lib/types';
import { Layout, ArrowRight, X, Settings2 } from 'lucide-react';
import { EdgeProperties } from './properties/EdgeProperties';
import { BulkNodeProperties } from './properties/BulkNodeProperties';
import { useTranslation } from 'react-i18next';
import { DiagramNodePropertiesRouter } from './properties/DiagramNodePropertiesRouter';

interface PropertiesPanelProps {
    selectedNodes: Node<NodeData>[];
    selectedNode: Node<NodeData> | null;
    selectedEdge: Edge | null;
    onChangeNode: (id: string, data: Partial<NodeData>) => void;
    onBulkChangeNodes: (updates: Partial<NodeData>, labelPrefix?: string, labelSuffix?: string) => number;
    onChangeNodeType: (id: string, type: string) => void;
    onChangeEdge: (id: string, updates: Partial<Edge>) => void;
    onDeleteNode: (id: string) => void;
    onDuplicateNode: (id: string) => void;
    onDeleteEdge: (id: string) => void;
    onUpdateZIndex: (id: string, action: 'front' | 'back') => void;
    onAddMindmapChild: (parentId: string) => void;
    onAddArchitectureService: (sourceId: string) => void;
    onCreateArchitectureBoundary: (sourceId: string) => void;
    onClose: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    selectedNodes,
    selectedNode,
    selectedEdge,
    onChangeNode,
    onBulkChangeNodes,
    onChangeNodeType,
    onChangeEdge,
    onDeleteNode,
    onDuplicateNode,
    onDeleteEdge,
    onUpdateZIndex,
    onAddMindmapChild,
    onAddArchitectureService,
    onCreateArchitectureBoundary,
    onClose
}) => {
    const { t } = useTranslation();

    if (!selectedNode && !selectedEdge) return null;

    const isAnnotation = selectedNode?.type === 'annotation';
    const isBulkEdit = selectedNodes.length > 1;
    const getSingleNodeTitle = (): string => {
        if (!selectedNode) {
            return t('propertiesPanel.nodeSettings');
        }

        switch (selectedNode.type) {
            case 'text':
                return t('propertiesPanel.textSettings', 'Text Settings');
            case 'annotation':
                return t('propertiesPanel.stickyNote');
            case 'section':
                return t('propertiesPanel.sectionSettings', 'Section Settings');
            case 'class':
                return t('propertiesPanel.classSettings', 'Class Settings');
            case 'er_entity':
                return t('propertiesPanel.erEntitySettings', 'ER Entity Settings');
            case 'mindmap':
                return t('propertiesPanel.mindmapNodeSettings', 'Mindmap Node Settings');
            case 'journey':
                return t('propertiesPanel.journeyNodeSettings', 'Journey Node Settings');
            case 'architecture':
                return t('propertiesPanel.architectureNodeSettings', 'Architecture Node Settings');
            case 'image':
                return t('propertiesPanel.imageSettings', 'Image Settings');
            default:
                return t('propertiesPanel.nodeSettings');
        }
    };

    return (
        <div className="absolute top-20 right-6 w-80 bg-[var(--brand-surface)]/95 backdrop-blur-md rounded-[var(--radius-lg)] shadow-2xl border border-white/20 ring-1 ring-black/5 flex flex-col overflow-hidden max-h-[calc(100vh-140px)] z-40 animate-in slide-in-from-right-10 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[var(--brand-surface)]">
                <h3 className="font-semibold text-[var(--brand-text)] flex items-center gap-2">
                    {selectedNode ? (
                        <>
                            <Settings2 className="w-4 h-4 text-[var(--brand-primary)]" />
                            <span>
                                {isBulkEdit
                                    ? `Bulk edit (${selectedNodes.length})`
                                    : (isAnnotation ? t('propertiesPanel.stickyNote') : getSingleNodeTitle())
                                }
                            </span>
                        </>
                    ) : (
                        <>
                            <ArrowRight className="w-4 h-4 text-[var(--brand-primary)]" />
                            <span>{t('propertiesPanel.connection')}</span>
                        </>
                    )}
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-[var(--brand-secondary)] transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar space-y-6 flex-1">
                {isBulkEdit && (
                    <BulkNodeProperties
                        selectedNodes={selectedNodes}
                        onApply={onBulkChangeNodes}
                    />
                )}

                {selectedNode && !isBulkEdit && (
                    <DiagramNodePropertiesRouter
                        selectedNode={selectedNode}
                        onChange={onChangeNode}
                        onDuplicate={onDuplicateNode}
                        onDelete={onDeleteNode}
                        onAddMindmapChild={onAddMindmapChild}
                        onAddArchitectureService={onAddArchitectureService}
                        onCreateArchitectureBoundary={onCreateArchitectureBoundary}
                    />
                )}

                {selectedEdge && (
                    <EdgeProperties
                        selectedEdge={selectedEdge}
                        onChange={onChangeEdge}
                        onDelete={onDeleteEdge}
                    />
                )}
            </div>
        </div>
    );
};
