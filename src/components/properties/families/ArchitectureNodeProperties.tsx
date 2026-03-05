import React from 'react';
import type { DiagramNodePropertiesComponentProps } from '@/diagram-types/core';
import { NodeProperties } from '@/components/properties/NodeProperties';
import { NodeActionButtons } from '@/components/properties/NodeActionButtons';
import { useFlowStore } from '@/store';

export function ArchitectureNodeProperties({
  selectedNode,
  onChange,
  onDuplicate,
  onDelete,
  onAddArchitectureService,
  onCreateArchitectureBoundary,
}: DiagramNodePropertiesComponentProps): React.ReactElement {
  const nodes = useFlowStore((state) => state.nodes);
  if (selectedNode.type !== 'architecture') {
    return (
      <NodeProperties
        selectedNode={selectedNode}
        onChange={onChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }
  const boundaryOptions = nodes.filter((node) => node.type === 'section');

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600">Resource Name</label>
        <input
          value={selectedNode.data.label || ''}
          onChange={(event) => onChange(selectedNode.id, { label: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="API Gateway"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Provider</label>
        <input
          value={selectedNode.data.archProvider || ''}
          onChange={(event) => onChange(selectedNode.id, { archProvider: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="aws, azure, gcp, k8s, custom"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Resource Type</label>
        <input
          value={selectedNode.data.archResourceType || ''}
          onChange={(event) => onChange(selectedNode.id, { archResourceType: event.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          placeholder="service, database, queue, group"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold text-slate-600">Environment</label>
          <input
            value={selectedNode.data.archEnvironment || ''}
            onChange={(event) => onChange(selectedNode.id, { archEnvironment: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="prod"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Boundary</label>
          <select
            value={selectedNode.data.archBoundaryId || ''}
            onChange={(event) => onChange(selectedNode.id, { archBoundaryId: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="">No boundary</option>
            {boundaryOptions.map((boundaryNode) => (
              <option key={boundaryNode.id} value={boundaryNode.id}>
                {boundaryNode.data?.label || boundaryNode.id}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">
              Boundary selection also updates containment.
            </span>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-400"
              onClick={() => onChange(selectedNode.id, { archBoundaryId: '' })}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold text-slate-600">Zone</label>
          <input
            value={selectedNode.data.archZone || ''}
            onChange={(event) => onChange(selectedNode.id, { archZone: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="public"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Trust Domain</label>
          <input
            value={selectedNode.data.archTrustDomain || ''}
            onChange={(event) => onChange(selectedNode.id, { archTrustDomain: event.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="internal"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Quick Semantics</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            onClick={() => onChange(selectedNode.id, { archZone: 'public' })}
          >
            Zone: Public
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            onClick={() => onChange(selectedNode.id, { archZone: 'private' })}
          >
            Zone: Private
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            onClick={() => onChange(selectedNode.id, { archTrustDomain: 'internal' })}
          >
            Trust: Internal
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400"
            onClick={() => onChange(selectedNode.id, { archTrustDomain: 'external' })}
          >
            Trust: External
          </button>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
        onClick={() => onAddArchitectureService?.(selectedNode.id)}
      >
        Add Connected Service
      </button>

      <button
        type="button"
        className="w-full rounded-md border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:border-violet-400"
        onClick={() => onCreateArchitectureBoundary?.(selectedNode.id)}
      >
        Create Boundary Group
      </button>

      <NodeActionButtons nodeId={selectedNode.id} onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
}
