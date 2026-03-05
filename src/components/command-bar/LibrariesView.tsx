import React, { useMemo, useState } from 'react';
import { CloudCog, Plus, Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { ViewHeader } from './ViewHeader';
import { useFlowStore } from '@/store';
import { createId } from '@/lib/id';
import { NamedIcon } from '../IconMap';
import {
    createDomainLibraryNode,
    DOMAIN_LIBRARY_ITEMS,
    type DomainLibraryCategory,
} from '@/services/domainLibrary';

interface LibrariesViewProps {
    onClose: () => void;
    handleBack: () => void;
}

const CATEGORY_LABELS: Record<DomainLibraryCategory, string> = {
    aws: 'AWS',
    azure: 'Azure',
    gcp: 'GCP',
    kubernetes: 'Kubernetes',
    network: 'Network',
    security: 'Security',
};

const CATEGORY_ORDER: DomainLibraryCategory[] = [
    'network',
    'security',
    'aws',
    'gcp',
    'azure',
    'kubernetes',
];

function getInsertPosition(index: number): { x: number; y: number } {
    const columns = 4;
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
        x: 100 + column * 90,
        y: 100 + row * 90,
    };
}

export const LibrariesView: React.FC<LibrariesViewProps> = ({
    onClose,
    handleBack,
}) => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<DomainLibraryCategory | 'all'>('all');
    const { nodes, setNodes, setSelectedNodeId, activeLayerId } = useFlowStore();

    const filteredItems = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return DOMAIN_LIBRARY_ITEMS.filter((item) => {
            const matchesCategory = category === 'all' || item.category === category;
            const matchesText = normalized.length === 0
                || item.label.toLowerCase().includes(normalized)
                || item.description.toLowerCase().includes(normalized);
            return matchesCategory && matchesText;
        });
    }, [category, query]);

    function handleInsert(itemId: string): void {
        const item = DOMAIN_LIBRARY_ITEMS.find((entry) => entry.id === itemId);
        if (!item) {
            return;
        }
        const id = createId('lib');
        const position = getInsertPosition(nodes.length);
        const newNode = createDomainLibraryNode(
            item,
            id,
            position,
            activeLayerId
        );
        setNodes((existingNodes) => existingNodes.concat(newNode));
        setSelectedNodeId(id);
        onClose();
    }

    return (
        <div className="flex flex-col h-full">
            <ViewHeader
                title="Domain Libraries"
                icon={<CloudCog className="w-4 h-4 text-[var(--brand-primary)]" />}
                onBack={handleBack}
            />

            <div className="px-4 py-2 border-b border-slate-100 space-y-2">
                <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => event.stopPropagation()}
                    placeholder="Search services..."
                    className="w-full focus:border-[var(--brand-primary-400)]"
                    autoFocus
                />
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setCategory('all')}
                        className={`h-7 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors ${category === 'all' ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                        All
                    </button>
                    {CATEGORY_ORDER.map((itemCategory) => (
                        <button
                            key={itemCategory}
                            onClick={() => setCategory(itemCategory)}
                            className={`h-7 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors ${category === itemCategory ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                            {CATEGORY_LABELS[itemCategory]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto p-2 grid grid-cols-1 gap-1 max-h-[350px]">
                {filteredItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleInsert(item.id)}
                        className="group flex items-start gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--brand-primary-50)] border border-transparent hover:border-[var(--brand-primary-100)] text-left transition-all"
                    >
                        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--brand-primary-50)] text-[var(--brand-primary-600)] flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <NamedIcon name={item.icon} fallbackName="Box" className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-slate-700 group-hover:text-[var(--brand-primary-900)] truncate">{item.label}</h4>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide">
                                    {CATEGORY_LABELS[item.category]}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 group-hover:text-[var(--brand-primary-700)]/70 line-clamp-1">{item.description}</p>
                        </div>
                        <Plus className="w-4 h-4 text-slate-300 group-hover:text-[var(--brand-primary-400)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
                {filteredItems.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        <div className="inline-flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            <span>No services found</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
