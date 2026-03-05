import React from 'react';
import type { DiagramNodePropertiesComponentProps } from '@/diagram-types/core';
import { NodeProperties } from '@/components/properties/NodeProperties';
import { NodeActionButtons } from '@/components/properties/NodeActionButtons';

function clampJourneyScore(raw: string): number | undefined {
  if (raw.trim() === '') return undefined;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return undefined;
  const rounded = Math.round(parsed);
  if (rounded < 0) return 0;
  if (rounded > 5) return 5;
  return rounded;
}

export function JourneyNodeProperties({
  selectedNode,
  onChange,
  onDuplicate,
  onDelete,
}: DiagramNodePropertiesComponentProps): React.ReactElement {
  if (selectedNode.type !== 'journey') {
    return (
      <NodeProperties
        selectedNode={selectedNode}
        onChange={onChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }

  const titleValue = selectedNode.data.journeyTask || selectedNode.data.label || '';
  const actorValue = selectedNode.data.journeyActor || selectedNode.data.subLabel || '';
  const sectionValue = selectedNode.data.journeySection || '';
  const scoreValue = typeof selectedNode.data.journeyScore === 'number' ? String(selectedNode.data.journeyScore) : '';

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600">Section</label>
        <input
          value={sectionValue}
          onChange={(event) => onChange(selectedNode.id, { journeySection: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="Journey section"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Step Title</label>
        <input
          value={titleValue}
          onChange={(event) => onChange(selectedNode.id, { label: event.target.value, journeyTask: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="Step task"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Actor</label>
        <input
          value={actorValue}
          onChange={(event) => onChange(selectedNode.id, { subLabel: event.target.value, journeyActor: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="Primary actor"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Score (0-5)</label>
        <input
          type="number"
          min={0}
          max={5}
          value={scoreValue}
          onChange={(event) => onChange(selectedNode.id, { journeyScore: clampJourneyScore(event.target.value) })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="0-5"
        />
      </div>

      <NodeActionButtons nodeId={selectedNode.id} onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
}
