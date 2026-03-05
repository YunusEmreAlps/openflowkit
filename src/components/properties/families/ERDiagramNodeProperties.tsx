import React from 'react';
import type { DiagramNodePropertiesComponentProps } from '@/diagram-types/core';
import { NodeProperties } from '@/components/properties/NodeProperties';
import { NodeActionButtons } from '@/components/properties/NodeActionButtons';

function parseLines(input: string): string[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function toMultiline(value: string[] | undefined): string {
  return Array.isArray(value) ? value.join('\n') : '';
}

export function ERDiagramNodeProperties({
  selectedNode,
  onChange,
  onDuplicate,
  onDelete,
}: DiagramNodePropertiesComponentProps): React.ReactElement {
  if (selectedNode.type !== 'er_entity') {
    return (
      <NodeProperties
        selectedNode={selectedNode}
        onChange={onChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }

  const fields = toMultiline(selectedNode.data.erFields);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600">Entity Name</label>
        <input
          value={selectedNode.data.label || ''}
          onChange={(event) => onChange(selectedNode.id, { label: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="Entity name"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Fields (one per line)</label>
        <textarea
          value={fields}
          onChange={(event) => onChange(selectedNode.id, { erFields: parseLines(event.target.value) })}
          className="mt-1 w-full min-h-[120px] rounded-md border border-slate-300 px-2 py-1.5 text-xs font-mono"
          placeholder="id UUID PK&#10;name STRING&#10;owner_id UUID FK"
        />
      </div>

      <NodeActionButtons nodeId={selectedNode.id} onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
}
