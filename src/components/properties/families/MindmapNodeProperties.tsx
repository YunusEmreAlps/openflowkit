import React from 'react';
import type { DiagramNodePropertiesComponentProps } from '@/diagram-types/core';
import { NodeProperties } from '@/components/properties/NodeProperties';
import { NodeActionButtons } from '@/components/properties/NodeActionButtons';

function getDepth(selectedNode: DiagramNodePropertiesComponentProps['selectedNode']): number {
  return typeof selectedNode.data.mindmapDepth === 'number' ? selectedNode.data.mindmapDepth : 0;
}

export function MindmapNodeProperties({
  selectedNode,
  onChange,
  onDuplicate,
  onDelete,
  onAddMindmapChild,
}: DiagramNodePropertiesComponentProps): React.ReactElement {
  if (selectedNode.type !== 'mindmap') {
    return (
      <NodeProperties
        selectedNode={selectedNode}
        onChange={onChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }

  const depth = getDepth(selectedNode);
  const isRoot = depth === 0;
  const nodeRole = isRoot ? 'Root Topic' : `Branch (depth ${depth})`;

  const enableRootEmphasis = (): void => {
    onChange(selectedNode.id, {
      color: 'slate',
      shape: 'rounded',
    });
  };

  const enableBranchStyle = (): void => {
    onChange(selectedNode.id, {
      color: 'blue',
      shape: 'rectangle',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600">Topic</label>
        <input
          value={selectedNode.data.label || ''}
          onChange={(event) => onChange(selectedNode.id, { label: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="Mindmap topic"
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hierarchy</div>
        <div className="mt-1 text-sm text-slate-700">{nodeRole}</div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Style Preset</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            onClick={enableRootEmphasis}
          >
            Root Emphasis
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            onClick={enableBranchStyle}
          >
            Branch Style
          </button>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
        onClick={() => onAddMindmapChild?.(selectedNode.id)}
      >
        Add Child Topic
      </button>

      <NodeActionButtons nodeId={selectedNode.id} onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
}
