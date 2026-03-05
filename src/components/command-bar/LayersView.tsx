import React, { useState } from 'react';
import { Eye, EyeOff, Layers, Lock, LockOpen, MoveVertical, Plus, Trash2 } from 'lucide-react';
import { useFlowStore } from '@/store';
import { ViewHeader } from './ViewHeader';

interface LayersViewProps {
    onClose: () => void;
    handleBack: () => void;
}

export function LayersView({ onClose, handleBack }: LayersViewProps): React.ReactElement {
    const [newLayerName, setNewLayerName] = useState('');
    const {
        layers,
        activeLayerId,
        setActiveLayerId,
        addLayer,
        renameLayer,
        deleteLayer,
        toggleLayerVisibility,
        toggleLayerLock,
        moveLayer,
        moveSelectedNodesToLayer,
        selectNodesInLayer,
    } = useFlowStore();

    function handleAddLayer(): void {
        const name = newLayerName.trim();
        const id = addLayer(name || undefined);
        setActiveLayerId(id);
        setNewLayerName('');
    }

    return (
        <div className="flex h-full flex-col">
            <ViewHeader title="Layers" icon={<Layers className="h-4 w-4 text-[var(--brand-primary)]" />} onBack={handleBack} />

            <div className="border-b border-slate-100 px-4 py-2">
                <div className="flex items-center gap-2">
                    <input
                        value={newLayerName}
                        onChange={(event) => setNewLayerName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleAddLayer();
                            }
                        }}
                        placeholder="New layer name"
                        className="h-9 w-full rounded-[var(--brand-radius)] border border-slate-300 bg-white px-3 text-sm"
                    />
                    <button
                        onClick={handleAddLayer}
                        className="inline-flex h-9 items-center gap-1 rounded-[var(--brand-radius)] border border-slate-300 bg-white px-3 text-xs font-medium"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {layers.map((layer) => (
                    <div
                        key={layer.id}
                        className={`rounded-[var(--radius-md)] border p-3 ${
                            activeLayerId === layer.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]' : 'border-slate-200 bg-white'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <input
                                value={layer.name}
                                onChange={(event) => renameLayer(layer.id, event.target.value)}
                                className="h-8 w-full rounded-[var(--brand-radius)] border border-slate-300 bg-white px-2 text-xs"
                            />
                            <button
                                onClick={() => setActiveLayerId(layer.id)}
                                className="h-8 rounded-[var(--brand-radius)] border border-slate-300 px-2 text-[11px]"
                            >
                                Active
                            </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <button
                                onClick={() => toggleLayerVisibility(layer.id)}
                                className="inline-flex h-7 items-center gap-1 rounded-[var(--brand-radius)] border border-slate-300 bg-white px-2 text-[11px]"
                            >
                                {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                {layer.visible ? 'Visible' : 'Hidden'}
                            </button>
                            <button
                                onClick={() => toggleLayerLock(layer.id)}
                                className="inline-flex h-7 items-center gap-1 rounded-[var(--brand-radius)] border border-slate-300 bg-white px-2 text-[11px]"
                            >
                                {layer.locked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
                                {layer.locked ? 'Locked' : 'Unlocked'}
                            </button>
                            <button
                                onClick={() => moveSelectedNodesToLayer(layer.id)}
                                className="inline-flex h-7 items-center gap-1 rounded-[var(--brand-radius)] border border-slate-300 bg-white px-2 text-[11px]"
                            >
                                <MoveVertical className="h-3 w-3" />
                                Move Selected Here
                            </button>
                            <button
                                onClick={() => selectNodesInLayer(layer.id)}
                                className="inline-flex h-7 items-center gap-1 rounded-[var(--brand-radius)] border border-slate-300 bg-white px-2 text-[11px]"
                            >
                                Select Layer
                            </button>
                            <button
                                onClick={() => moveLayer(layer.id, 'up')}
                                className="inline-flex h-7 items-center rounded-[var(--brand-radius)] border border-slate-300 bg-white px-2 text-[11px]"
                            >
                                Up
                            </button>
                            <button
                                onClick={() => moveLayer(layer.id, 'down')}
                                className="inline-flex h-7 items-center rounded-[var(--brand-radius)] border border-slate-300 bg-white px-2 text-[11px]"
                            >
                                Down
                            </button>
                            {layer.id !== 'default' && (
                                <button
                                    onClick={() => deleteLayer(layer.id)}
                                    className="inline-flex h-7 items-center gap-1 rounded-[var(--brand-radius)] border border-red-200 bg-red-50 px-2 text-[11px] text-red-600"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">
                Layer lock disables drag. Hidden layers are excluded from canvas render.
                <button
                    onClick={onClose}
                    className="ml-2 rounded-[var(--brand-radius)] border border-slate-300 px-2 py-1 text-[11px]"
                >
                    Done
                </button>
            </div>
        </div>
    );
}
