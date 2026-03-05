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

export function ClassDiagramNodeProperties({
  selectedNode,
  onChange,
  onDuplicate,
  onDelete,
}: DiagramNodePropertiesComponentProps): React.ReactElement {
  if (selectedNode.type !== 'class') {
    return (
      <NodeProperties
        selectedNode={selectedNode}
        onChange={onChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }

  const attributes = toMultiline(selectedNode.data.classAttributes);
  const methods = toMultiline(selectedNode.data.classMethods);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600">Class Name</label>
        <input
          value={selectedNode.data.label || ''}
          onChange={(event) => onChange(selectedNode.id, { label: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="Class name"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Stereotype</label>
        <input
          value={selectedNode.data.classStereotype || ''}
          onChange={(event) => onChange(selectedNode.id, { classStereotype: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="interface, abstract, service..."
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Attributes (one per line)</label>
        <textarea
          value={attributes}
          onChange={(event) => onChange(selectedNode.id, { classAttributes: parseLines(event.target.value) })}
          className="mt-1 w-full min-h-[88px] rounded-md border border-slate-300 px-2 py-1.5 text-xs font-mono"
          placeholder="+id: UUID&#10;+name: String"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Methods (one per line)</label>
        <textarea
          value={methods}
          onChange={(event) => onChange(selectedNode.id, { classMethods: parseLines(event.target.value) })}
          className="mt-1 w-full min-h-[88px] rounded-md border border-slate-300 px-2 py-1.5 text-xs font-mono"
          placeholder="+createUser(name: String): User"
        />
      </div>

      <NodeActionButtons nodeId={selectedNode.id} onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
}
