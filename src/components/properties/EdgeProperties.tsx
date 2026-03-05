import React from 'react';
import type { Edge } from 'reactflow';
import { useFlowStore } from '@/store';
import { EdgeConditionSection } from './edge/EdgeConditionSection';
import { EdgeDeleteSection } from './edge/EdgeDeleteSection';
import { EdgeLabelSection } from './edge/EdgeLabelSection';
import { EdgeStyleSection } from './edge/EdgeStyleSection';
import { ArchitectureEdgeSemanticsSection } from './edge/ArchitectureEdgeSemanticsSection';

interface EdgePropertiesProps {
    selectedEdge: Edge;
    onChange: (id: string, updates: Partial<Edge>) => void;
    onDelete: (id: string) => void;
}

export const EdgeProperties: React.FC<EdgePropertiesProps> = ({
    selectedEdge,
    onChange,
    onDelete
}) => {
    const { nodes } = useFlowStore();
    const sourceNode = nodes.find((node) => node.id === selectedEdge.source);
    const targetNode = nodes.find((node) => node.id === selectedEdge.target);
    const isArchitectureEdge = sourceNode?.type === 'architecture' && targetNode?.type === 'architecture';

    return (
        <div className="space-y-6">
            {isArchitectureEdge && (
                <ArchitectureEdgeSemanticsSection selectedEdge={selectedEdge} onChange={onChange} />
            )}
            <EdgeConditionSection selectedEdge={selectedEdge} onChange={onChange} />
            <EdgeLabelSection selectedEdge={selectedEdge} onChange={onChange} />
            <EdgeStyleSection selectedEdge={selectedEdge} onChange={onChange} />
            <EdgeDeleteSection selectedEdge={selectedEdge} onDelete={onDelete} />
        </div>
    );
};
