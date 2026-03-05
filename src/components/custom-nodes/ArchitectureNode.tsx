import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import type { NodeData } from '@/lib/types';
import { useInlineNodeTextEdit } from '@/hooks/useInlineNodeTextEdit';

function ArchitectureNode({ id, data, selected }: NodeProps<NodeData>): React.ReactElement {
  const labelEdit = useInlineNodeTextEdit(id, 'label', data.label || '');
  const provider = data.archProvider || 'custom';
  const resourceType = data.archResourceType || 'service';
  const environment = data.archEnvironment || 'default';
  const styleByResource: Record<string, { shell: string; providerBadge: string; icon: string }> = {
    group: {
      shell: 'border-violet-300 bg-violet-50/60',
      providerBadge: 'bg-violet-100 text-violet-700 border-violet-200',
      icon: '◼',
    },
    junction: {
      shell: 'border-amber-300 bg-amber-50/60',
      providerBadge: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: '◆',
    },
    service: {
      shell: 'border-slate-200 bg-white',
      providerBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: '▣',
    },
  };
  const currentStyle = styleByResource[resourceType] ?? styleByResource.service;

  return (
    <>
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        isConnectableStart
        isConnectableEnd
        className={`!w-3 !h-3 !bg-slate-400 !border-2 !border-white transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
      />
      <Handle
        type="source"
        id="left"
        position={Position.Left}
        isConnectableStart
        isConnectableEnd
        className={`!w-3 !h-3 !bg-slate-400 !border-2 !border-white transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
      />

      <div
        className={`group min-w-[180px] rounded-xl border px-3 py-2 shadow-sm ${currentStyle.shell} ${
          selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wide text-slate-500">
          <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold ${currentStyle.providerBadge}`}>
            <span>{currentStyle.icon}</span>
            <span>{provider}</span>
          </span>
          <span className="font-semibold text-slate-500">{resourceType}</span>
        </div>
        <div
          className="mt-1 text-sm font-semibold text-slate-800 break-words"
          onClick={(event) => {
            event.stopPropagation();
            labelEdit.beginEdit();
          }}
        >
          {labelEdit.isEditing ? (
            <input
              autoFocus
              value={labelEdit.draft}
              onChange={(event) => labelEdit.setDraft(event.target.value)}
              onBlur={labelEdit.commit}
              onKeyDown={labelEdit.handleKeyDown}
              onMouseDown={(event) => event.stopPropagation()}
              className="w-full rounded border border-[var(--brand-primary)] bg-white px-1 py-0.5 outline-none"
            />
          ) : (
            data.label || 'Architecture Node'
          )}
        </div>
        <div className="mt-1 inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
          {environment}
        </div>
      </div>

      <Handle
        type="source"
        id="right"
        position={Position.Right}
        isConnectableStart
        isConnectableEnd
        className={`!w-3 !h-3 !bg-slate-400 !border-2 !border-white transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        isConnectableStart
        isConnectableEnd
        className={`!w-3 !h-3 !bg-slate-400 !border-2 !border-white transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
      />
    </>
  );
}

export default memo(ArchitectureNode);
