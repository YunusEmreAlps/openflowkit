import React, { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';
import { NodeData } from '@/lib/types';
import { Group } from 'lucide-react';
import { NamedIcon } from './IconMap';
import { SECTION_COLOR_PALETTE } from '../theme';
import { useInlineNodeTextEdit } from '@/hooks/useInlineNodeTextEdit';



function SectionNode({ id, data, selected }: NodeProps<NodeData>): React.ReactElement {
  const color = data.color || 'blue';
  const theme = SECTION_COLOR_PALETTE[color] || SECTION_COLOR_PALETTE.blue;
  const iconName = data.icon || 'Group';
  const labelEdit = useInlineNodeTextEdit(id, 'label', data.label || '');
  const subLabelEdit = useInlineNodeTextEdit(id, 'subLabel', data.subLabel || '');

  return (
    <>
      <NodeResizer
        color={theme.border}
        isVisible={selected}
        minWidth={350}
        minHeight={250}
        lineStyle={{ borderStyle: 'dashed', borderWidth: 2 }}
        handleStyle={{ width: 12, height: 12, borderRadius: 6 }}
      />
      <div
        className={`
          w-full h-full rounded-2xl border-2 border-dashed transition-all duration-200
          ${selected ? 'ring-2 ring-offset-2 z-10' : ''}
        `}
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
          minWidth: 350,
          minHeight: 250,
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-t-2xl cursor-grab active:cursor-grabbing"
          style={{ borderBottom: `1px dashed ${theme.border}` }}
        >
          {iconName ? (
            <NamedIcon name={iconName} fallbackName="Group" className="w-4 h-4 flow-lod-far-target" style={{ color: theme.title }} />
          ) : (
            <Group className="w-4 h-4 flow-lod-far-target" style={{ color: theme.title }} />
          )}
          <span
            className="font-bold text-sm tracking-tight"
            style={{ color: theme.title }}
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
                className="rounded border border-slate-300 bg-white/90 px-1 py-0.5 outline-none"
              />
            ) : (
              data.label || 'Section'
            )}
          </span>
          {data.subLabel && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full flow-lod-secondary ${theme.badge}`}
              onClick={(event) => {
                event.stopPropagation();
                subLabelEdit.beginEdit();
              }}
            >
              {subLabelEdit.isEditing ? (
                <input
                  autoFocus
                  value={subLabelEdit.draft}
                  onChange={(event) => subLabelEdit.setDraft(event.target.value)}
                  onBlur={subLabelEdit.commit}
                  onKeyDown={subLabelEdit.handleKeyDown}
                  onMouseDown={(event) => event.stopPropagation()}
                  className="rounded border border-slate-300 bg-white/90 px-1 py-0.5 outline-none"
                />
              ) : (
                data.subLabel
              )}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(SectionNode);
