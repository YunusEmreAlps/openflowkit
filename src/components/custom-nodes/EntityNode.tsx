import React, { memo } from 'react';
import { Handle, NodeProps, NodeResizer, Position } from 'reactflow';
import type { NodeData } from '@/lib/types';
import { useInlineNodeTextEdit } from '@/hooks/useInlineNodeTextEdit';
import { useFlowStore } from '@/store';

function EntityNode({ id, data, selected }: NodeProps<NodeData>): React.ReactElement {
  const fields = Array.isArray(data.erFields) ? data.erFields : [];
  const labelEdit = useInlineNodeTextEdit(id, 'label', data.label || '');
  const { setNodes } = useFlowStore();
  const [editingFieldIndex, setEditingFieldIndex] = React.useState<number | null>(null);
  const [fieldDraft, setFieldDraft] = React.useState('');

  const updateField = React.useCallback((index: number, value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id) return node;
        const current = Array.isArray(node.data?.erFields) ? [...node.data.erFields] : [];
        if (index >= current.length) {
          current.push(value);
        } else {
          current[index] = value;
        }
        return { ...node, data: { ...node.data, erFields: current } };
      })
    );
  }, [id, setNodes]);

  const beginFieldEdit = (index: number, value: string) => {
    setEditingFieldIndex(index);
    setFieldDraft(value);
  };

  const commitFieldEdit = () => {
    if (editingFieldIndex === null) return;
    const trimmed = fieldDraft.trim();
    if (trimmed) {
      updateField(editingFieldIndex, trimmed);
    }
    setEditingFieldIndex(null);
  };

  return (
    <>
      <NodeResizer
        color="#94a3b8"
        isVisible={selected}
        minWidth={220}
        minHeight={130}
        lineStyle={{ borderStyle: 'solid', borderWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
      />

      <div
        className={`bg-white border border-slate-300 rounded-lg shadow-sm min-w-[220px] ${
          selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
        }`}
      >
        <div className="border-b border-slate-300 px-3 py-2 bg-slate-50 rounded-t-lg">
          <div className="text-[11px] font-semibold text-slate-500">Entity</div>
          <div
            className="text-sm font-semibold text-slate-800 break-words"
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
                className="w-full rounded border border-slate-300 bg-white/90 px-1 py-0.5 outline-none"
              />
            ) : (
              data.label || 'Entity'
            )}
          </div>
        </div>

        <div className="px-3 py-2">
          {fields.length > 0 ? (
            <ul className="space-y-1">
              {fields.map((field, index) => (
                <li key={`field-${index}`} className="text-xs text-slate-700 font-mono break-words">
                  {editingFieldIndex === index ? (
                    <input
                      autoFocus
                      value={fieldDraft}
                      onChange={(event) => setFieldDraft(event.target.value)}
                      onBlur={commitFieldEdit}
                      onMouseDown={(event) => event.stopPropagation()}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          setEditingFieldIndex(null);
                        }
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          commitFieldEdit();
                        }
                      }}
                      className="w-full rounded border border-slate-300 bg-white px-1 py-0.5 outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      className="w-full text-left hover:bg-slate-50 rounded px-1 -mx-1"
                      onClick={(event) => {
                        event.stopPropagation();
                        beginFieldEdit(index, field);
                      }}
                    >
                      {field}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[11px] text-slate-400">No fields</div>
          )}
          <button
            type="button"
            className="mt-1 text-[11px] text-slate-500 hover:text-slate-700"
            onClick={(event) => {
              event.stopPropagation();
              beginFieldEdit(fields.length, '');
            }}
          >
            + Add field
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectableStart
        isConnectableEnd
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectableStart
        isConnectableEnd
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectableStart
        isConnectableEnd
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectableStart
        isConnectableEnd
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
    </>
  );
}

export default memo(EntityNode);
