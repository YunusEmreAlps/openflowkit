import React, { useMemo, useState } from 'react';
import type { Node } from 'reactflow';
import type { NodeData } from '@/lib/types';
import { Box, Palette, Star, Type } from 'lucide-react';
import { CollapsibleSection } from '../ui/CollapsibleSection';
import { ShapeSelector } from './ShapeSelector';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';

interface BulkNodePropertiesProps {
    selectedNodes: Node<NodeData>[];
    onApply: (updates: Partial<NodeData>, labelPrefix?: string, labelSuffix?: string) => number;
}

export function BulkNodeProperties({ selectedNodes, onApply }: BulkNodePropertiesProps): React.ReactElement {
    const [shape, setShape] = useState<NodeData['shape'] | ''>('');
    const [color, setColor] = useState<string>('');
    const [icon, setIcon] = useState<string>('');
    const [customIconUrl, setCustomIconUrl] = useState<string | undefined>(undefined);
    const [labelPrefix, setLabelPrefix] = useState('');
    const [labelSuffix, setLabelSuffix] = useState('');

    const changeSummary = useMemo(() => {
        const updates: string[] = [];
        if (shape) updates.push(`shape: ${shape}`);
        if (color) updates.push(`color: ${color}`);
        if (icon) updates.push(`icon: ${icon}`);
        if (customIconUrl) updates.push('custom icon: uploaded image');
        if (labelPrefix) updates.push(`label prefix: "${labelPrefix}"`);
        if (labelSuffix) updates.push(`label suffix: "${labelSuffix}"`);
        return updates;
    }, [shape, color, icon, customIconUrl, labelPrefix, labelSuffix]);

    const hasChanges = changeSummary.length > 0;

    function handleApply(): void {
        if (!hasChanges) {
            return;
        }

        const updates: Partial<NodeData> = {};
        if (shape) updates.shape = shape;
        if (color) updates.color = color;
        if (icon) updates.icon = icon;
        if (customIconUrl) updates.customIconUrl = customIconUrl;
        onApply(updates, labelPrefix, labelSuffix);
        setLabelPrefix('');
        setLabelSuffix('');
    }

    return (
        <div className="space-y-4">
            <p className="text-xs text-slate-500">
                {selectedNodes.length} nodes selected. Configure shared updates and apply in one history step.
            </p>

            <CollapsibleSection
                title="Bulk Appearance"
                icon={<Box className="w-3.5 h-3.5" />}
                isOpen={true}
                onToggle={() => {}}
            >
                <ShapeSelector selectedShape={shape || undefined} onChange={setShape} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Bulk Color"
                icon={<Palette className="w-3.5 h-3.5" />}
                isOpen={true}
                onToggle={() => {}}
            >
                <ColorPicker selectedColor={color || undefined} onChange={setColor} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Bulk Icon"
                icon={<Star className="w-3.5 h-3.5" />}
                isOpen={true}
                onToggle={() => {}}
            >
                <IconPicker
                    selectedIcon={icon || undefined}
                    onChange={setIcon}
                    customIconUrl={customIconUrl}
                    onCustomIconChange={setCustomIconUrl}
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Label Transform"
                icon={<Type className="w-3.5 h-3.5" />}
                isOpen={true}
                onToggle={() => {}}
            >
                <div className="space-y-2">
                    <input
                        value={labelPrefix}
                        onChange={(event) => setLabelPrefix(event.target.value)}
                        placeholder="Prefix (optional)"
                        className="w-full rounded-[var(--brand-radius)] border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                    <input
                        value={labelSuffix}
                        onChange={(event) => setLabelSuffix(event.target.value)}
                        placeholder="Suffix (optional)"
                        className="w-full rounded-[var(--brand-radius)] border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                </div>
            </CollapsibleSection>

            <div className="rounded-[var(--brand-radius)] border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600">Preview summary</div>
                {hasChanges ? (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
                        <li>{`Will update ${selectedNodes.length} selected nodes`}</li>
                        {changeSummary.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2 text-xs text-slate-500">Select at least one field to apply.</p>
                )}
            </div>

            <button
                onClick={handleApply}
                disabled={!hasChanges}
                className="w-full rounded-[var(--brand-radius)] bg-[var(--brand-primary)] px-3 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
                Apply to selected nodes
            </button>
        </div>
    );
}
