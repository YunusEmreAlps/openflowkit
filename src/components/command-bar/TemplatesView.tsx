import React, { useState, useMemo } from 'react';
import { Layout, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/Input';
import { ViewHeader } from './ViewHeader';
import { getFlowTemplates, type FlowTemplate } from '../../services/templates';
import { trackEvent } from '../../lib/analytics';

interface TemplatesViewProps {
    onSelectTemplate?: (t: FlowTemplate) => void;
    onClose: () => void;
    handleBack: () => void;
}

export const TemplatesView = ({
    onSelectTemplate,
    onClose,
    handleBack
}: TemplatesViewProps) => {
    const { t } = useTranslation();
    const [tSearch, setTSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const templates = useMemo(() => getFlowTemplates(), []);
    const categories = useMemo(() => Array.from(new Set(templates.map((template) => template.category))).sort((left, right) => left.localeCompare(right)), [templates]);

    const handleSelect = (template: FlowTemplate) => {
        trackEvent('use_template', { template_id: template.id, template_name: template.name });
        onSelectTemplate?.(template);
        onClose();
    };

    const filteredTemplates = useMemo(() => {
        const normalizedSearch = tSearch.trim().toLowerCase();
        return templates.filter((template) => {
            if (activeCategory !== 'all' && template.category !== activeCategory) {
                return false;
            }
            if (!normalizedSearch) {
                return true;
            }
            return template.name.toLowerCase().includes(normalizedSearch)
                || template.description.toLowerCase().includes(normalizedSearch)
                || template.category.toLowerCase().includes(normalizedSearch)
                || template.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
        });
    }, [activeCategory, tSearch, templates]);

    return (
        <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.08),_transparent_48%)]">
            <ViewHeader title={t('commandBar.templates.title')} icon={<Layout className="w-4 h-4 text-[var(--brand-primary)]" />} onBack={handleBack} />

            <div className="border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur-sm">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={tSearch}
                        onChange={(e) => setTSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder={t('commandBar.templates.placeholder')}
                        className="w-full pl-10 focus:border-[var(--brand-primary-400)]"
                        autoFocus
                    />
                </div>

                <div className="mt-3 -mx-1 overflow-x-auto pb-1 no-scrollbar">
                    <div className="flex min-w-max gap-2 px-1">
                        <button
                            type="button"
                            onClick={() => setActiveCategory('all')}
                            className={`h-9 shrink-0 rounded-[var(--radius-md)] border px-3 text-xs font-semibold transition-colors ${
                                activeCategory === 'all'
                                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
                            }`}
                        >
                            ALL
                            <span className={`ml-2 text-[10px] ${activeCategory === 'all' ? 'text-white/75' : 'text-slate-400'}`}>
                                {templates.length}
                            </span>
                        </button>
                        {categories.map((category) => {
                            const count = templates.filter((template) => template.category === category).length;
                            const isActive = activeCategory === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`h-9 shrink-0 rounded-[var(--radius-md)] border px-3 text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-sm'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
                                    }`}
                                >
                                    {category.toUpperCase()}
                                    <span className={`ml-2 text-[10px] ${isActive ? 'text-white/75' : 'text-slate-400'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        {filteredTemplates.map((template) => {
                            const Icon = template.icon;
                            return (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => handleSelect(template)}
                                    className="group flex min-h-[136px] flex-col rounded-[var(--radius-lg)] border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-[var(--brand-primary-200)] hover:bg-slate-50 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-slate-200 bg-slate-50 text-slate-600 transition-colors group-hover:border-[var(--brand-primary-200)] group-hover:text-[var(--brand-primary)]">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                                            {template.category}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex-1">
                                        <div className="line-clamp-2 text-[0.95rem] font-semibold tracking-tight text-slate-900">
                                            {template.name}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
                                        <span className="truncate">{template.tags[0] || template.category}</span>
                                        <span>{template.nodes.length} nodes</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : null}
                {filteredTemplates.length === 0 && (
                    <div className="rounded-[var(--radius-lg)] border border-dashed border-slate-200 bg-white/80 px-4 py-10 text-center text-sm text-slate-400">
                        {t('commandBar.templates.noResults')}
                    </div>
                )}
            </div>
        </div>
    );
};
