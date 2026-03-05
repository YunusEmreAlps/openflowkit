import React, { memo } from 'react';
import { Handle, NodeProps, NodeResizer, Position } from 'reactflow';
import type { NodeData } from '@/lib/types';
import { useInlineNodeTextEdit } from '@/hooks/useInlineNodeTextEdit';
import { useFlowStore } from '@/store';

function ClassNode({ id, data, selected }: NodeProps<NodeData>): React.ReactElement {
  const attributes = Array.isArray(data.classAttributes) ? data.classAttributes : [];
  const methods = Array.isArray(data.classMethods) ? data.classMethods : [];
  const labelEdit = useInlineNodeTextEdit(id, 'label', data.label || '');
  const stereotypeEdit = useInlineNodeTextEdit(id, 'classStereotype', data.classStereotype || '');
  const { setNodes } = useFlowStore();
  const [editingAttributeIndex, setEditingAttributeIndex] = React.useState<number | null>(null);
  const [editingMethodIndex, setEditingMethodIndex] = React.useState<number | null>(null);
  const [listDraft, setListDraft] = React.useState('');

  const updateClassList = React.useCallback((key: 'classAttributes' | 'classMethods', index: number, nextValue: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id) return node;
        const current = Array.isArray(node.data?.[key]) ? [...(node.data?.[key] as string[])] : [];
        if (index >= current.length) {
          current.push(nextValue);
        } else {
          current[index] = nextValue;
        }
        return { ...node, data: { ...node.data, [key]: current } };
      })
    );
  }, [id, setNodes]);

  const beginAttributeEdit = (index: number, value: string) => {
    setEditingMethodIndex(null);
    setEditingAttributeIndex(index);
    setListDraft(value);
  };

  const beginMethodEdit = (index: number, value: string) => {
    setEditingAttributeIndex(null);
    setEditingMethodIndex(index);
    setListDraft(value);
  };

  const commitAttributeEdit = () => {
    if (editingAttributeIndex === null) return;
    const trimmed = listDraft.trim();
    if (trimmed) {
      updateClassList('classAttributes', editingAttributeIndex, trimmed);
    }
    setEditingAttributeIndex(null);
  };

  const commitMethodEdit = () => {
    if (editingMethodIndex === null) return;
    const trimmed = listDraft.trim();
    if (trimmed) {
      updateClassList('classMethods', editingMethodIndex, trimmed);
    }
    setEditingMethodIndex(null);
  };

  return (
    <>
      <NodeResizer
        color="#94a3b8"
        isVisible={selected}
        minWidth={220}
        minHeight={140}
        lineStyle={{ borderStyle: 'solid', borderWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
      />

      <div
        className={`bg-white border border-slate-300 rounded-lg shadow-sm min-w-[220px] ${
          selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
        }`}
      >
        <div className="border-b border-slate-300 px-3 py-2 text-center">
          {data.classStereotype && (
            <div
              className="text-[10px] text-slate-500 leading-tight"
              onClick={(event) => {
                event.stopPropagation();
                stereotypeEdit.beginEdit();
              }}
            >
              {stereotypeEdit.isEditing ? (
                <input
                  autoFocus
                  value={stereotypeEdit.draft}
                  onChange={(event) => stereotypeEdit.setDraft(event.target.value)}
                  onBlur={stereotypeEdit.commit}
                  onKeyDown={stereotypeEdit.handleKeyDown}
                  onMouseDown={(event) => event.stopPropagation()}
                  className="w-full rounded border border-slate-300 bg-white/90 px-1 py-0.5 text-center outline-none"
                />
              ) : (
                `<<${data.classStereotype}>>`
              )}
            </div>
          )}
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
                className="w-full rounded border border-slate-300 bg-white/90 px-1 py-0.5 text-center outline-none"
              />
            ) : (
              data.label || 'Class'
            )}
          </div>
        </div>

        <div className="border-b border-slate-300 px-3 py-2">
          {attributes.length > 0 ? (
            <ul className="space-y-1">
              {attributes.map((attribute, index) => (
                <li key={`attr-${index}`} className="text-xs text-slate-700 font-mono break-words">
                  {editingAttributeIndex === index ? (
                    <input
                      autoFocus
                      value={listDraft}
                      onChange={(event) => setListDraft(event.target.value)}
                      onBlur={commitAttributeEdit}
                      onMouseDown={(event) => event.stopPropagation()}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          setEditingAttributeIndex(null);
                        }
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          commitAttributeEdit();
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
                        beginAttributeEdit(index, attribute);
                      }}
                    >
                      {attribute}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[11px] text-slate-400">No attributes</div>
          )}
          <button
            type="button"
            className="mt-1 text-[11px] text-slate-500 hover:text-slate-700"
            onClick={(event) => {
              event.stopPropagation();
              beginAttributeEdit(attributes.length, '');
            }}
          >
            + Add attribute
          </button>
        </div>

        <div className="px-3 py-2">
          {methods.length > 0 ? (
            <ul className="space-y-1">
              {methods.map((method, index) => (
                <li key={`method-${index}`} className="text-xs text-slate-700 font-mono break-words">
                  {editingMethodIndex === index ? (
                    <input
                      autoFocus
                      value={listDraft}
                      onChange={(event) => setListDraft(event.target.value)}
                      onBlur={commitMethodEdit}
                      onMouseDown={(event) => event.stopPropagation()}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          setEditingMethodIndex(null);
                        }
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          commitMethodEdit();
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
                        beginMethodEdit(index, method);
                      }}
                    >
                      {method}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[11px] text-slate-400">No methods</div>
          )}
          <button
            type="button"
            className="mt-1 text-[11px] text-slate-500 hover:text-slate-700"
            onClick={(event) => {
              event.stopPropagation();
              beginMethodEdit(methods.length, '');
            }}
          >
            + Add method
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

export default memo(ClassNode);
