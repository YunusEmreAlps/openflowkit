import { useCallback, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useFlowStore } from '@/store';
import type { NodeData } from '@/lib/types';

type EditableField = 'label' | 'subLabel' | 'classStereotype';

export function useInlineNodeTextEdit(nodeId: string, field: EditableField, initialValue: string): {
  isEditing: boolean;
  draft: string;
  beginEdit: () => void;
  setDraft: (value: string) => void;
  commit: () => void;
  cancel: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
} {
  const { setNodes } = useFlowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraftState] = useState(initialValue ?? '');

  const beginEdit = useCallback(() => {
    setDraftState(initialValue ?? '');
    setIsEditing(true);
  }, [initialValue]);

  const setDraft = useCallback((value: string) => {
    setDraftState(value);
  }, []);

  const commit = useCallback(() => {
    const nextValue = draft.trim();
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: nextValue,
              } as NodeData,
            }
          : node
      )
    );
    setIsEditing(false);
  }, [draft, field, nodeId, setNodes]);

  const cancel = useCallback(() => {
    setDraftState(initialValue ?? '');
    setIsEditing(false);
  }, [initialValue]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (event.key === 'Escape') {
        event.preventDefault();
        cancel();
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        commit();
      }
    },
    [cancel, commit]
  );

  return { isEditing, draft, beginEdit, setDraft, commit, cancel, handleKeyDown };
}
