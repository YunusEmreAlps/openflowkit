import type { FlowEditorMode, StudioTab } from '@/hooks/useFlowEditorUIState';

interface SelectionSnapshot {
    selectedNodeId: string | null;
    selectedEdgeId: string | null;
}

interface ShouldExitStudioOnSelectionParams extends SelectionSnapshot {
    editorMode: FlowEditorMode;
    studioTab: StudioTab;
    studioSelectionSnapshot: SelectionSnapshot | null;
}

function hasSelectionChanged(
    studioSelectionSnapshot: SelectionSnapshot | null,
    selectedNodeId: string | null,
    selectedEdgeId: string | null
): boolean {
    if (!studioSelectionSnapshot) {
        return false;
    }

    return (
        studioSelectionSnapshot.selectedNodeId !== selectedNodeId ||
        studioSelectionSnapshot.selectedEdgeId !== selectedEdgeId
    );
}

export function shouldExitStudioOnSelection({
    editorMode,
    studioTab,
    studioSelectionSnapshot,
    selectedNodeId,
    selectedEdgeId,
}: ShouldExitStudioOnSelectionParams): boolean {
    if (editorMode !== 'studio') {
        return false;
    }

    if (studioTab === 'playback') {
        return false;
    }

    if (!selectedNodeId && !selectedEdgeId) {
        return false;
    }

    return hasSelectionChanged(studioSelectionSnapshot, selectedNodeId, selectedEdgeId);
}

export type { SelectionSnapshot };
