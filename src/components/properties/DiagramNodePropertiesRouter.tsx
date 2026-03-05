import React from 'react';
import { useFlowStore } from '@/store';
import type { Node } from 'reactflow';
import type { NodeData } from '@/lib/types';
import { getDiagramNodeProperties } from '@/diagram-types/core';
import { registerBuiltInPropertyPanels } from '@/diagram-types/registerBuiltInPropertyPanels';
import { NodeProperties } from './NodeProperties';

interface DiagramNodePropertiesRouterProps {
  selectedNode: Node<NodeData>;
  onChange: (id: string, data: Partial<NodeData>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAddMindmapChild?: (parentId: string) => void;
  onAddArchitectureService?: (sourceId: string) => void;
  onCreateArchitectureBoundary?: (sourceId: string) => void;
}

export function DiagramNodePropertiesRouter({
  selectedNode,
  onChange,
  onDuplicate,
  onDelete,
  onAddMindmapChild,
  onAddArchitectureService,
  onCreateArchitectureBoundary,
}: DiagramNodePropertiesRouterProps): React.ReactElement {
  const { tabs, activeTabId } = useFlowStore();
  registerBuiltInPropertyPanels();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const diagramType = activeTab?.diagramType ?? 'flowchart';
  const RegisteredComponent = getDiagramNodeProperties(diagramType);

  if (!RegisteredComponent) {
    return (
      <NodeProperties
        selectedNode={selectedNode}
        onChange={onChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }

  return (
    // eslint-disable-next-line react-hooks/static-components
    <RegisteredComponent
      selectedNode={selectedNode}
      onChange={onChange}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onAddMindmapChild={onAddMindmapChild}
      onAddArchitectureService={onAddArchitectureService}
      onCreateArchitectureBoundary={onCreateArchitectureBoundary}
    />
  );
}
