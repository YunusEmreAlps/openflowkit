import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import type { NodeData } from '@/lib/types';
import { useInlineNodeTextEdit } from '@/hooks/useInlineNodeTextEdit';

function MindmapNode({ id, data, selected }: NodeProps<NodeData>): React.ReactElement {
  const labelEdit = useInlineNodeTextEdit(id, 'label', data.label || '');
  const depth = typeof (data as NodeData & { mindmapDepth?: number }).mindmapDepth === 'number'
    ? (data as NodeData & { mindmapDepth?: number }).mindmapDepth!
    : 0;

  const isRoot = depth === 0;
  const surfaceClass = isRoot
    ? 'bg-slate-900 text-white border-slate-900'
    : 'bg-white text-slate-800 border-slate-200';

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        isConnectableStart
        isConnectableEnd
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />

      <div
        className={`min-w-[120px] max-w-[260px] rounded-xl border px-3 py-2 shadow-sm transition-all ${surfaceClass} ${
          selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
        }`}
      >
        <div
          className={`text-sm leading-snug break-words ${isRoot ? 'font-semibold' : 'font-medium'}`}
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
              className="w-full rounded border border-[var(--brand-primary)] bg-white px-1 py-0.5 text-slate-900 outline-none"
            />
          ) : (
            data.label || 'Topic'
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectableStart
        isConnectableEnd
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
    </>
  );
}

export default memo(MindmapNode);
