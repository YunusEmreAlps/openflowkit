import React, { lazy, Suspense } from 'react';
import { Code2, ListVideo, WandSparkles } from 'lucide-react';
import { ROLLOUT_FLAGS } from '@/config/rolloutFlags';
import type { FlowEdge, FlowNode } from '@/lib/types';
import type { ChatMessage } from '@/services/aiService';
import type { StudioCodeMode, StudioTab } from '@/hooks/useFlowEditorUIState';
import type { SupportedLanguage } from '@/hooks/ai-generation/codeToArchitecture';
import { SidebarBody, SidebarHeader, SidebarSegmentedTabs, SidebarShell } from './SidebarShell';

const LazyStudioAIPanel = lazy(async () => {
    const module = await import('./StudioAIPanel');
    return { default: module.StudioAIPanel };
});

const LazyStudioCodePanel = lazy(async () => {
    const module = await import('./StudioCodePanel');
    return { default: module.StudioCodePanel };
});
const LazyStudioPlaybackPanel = lazy(async () => {
    const module = await import('./StudioPlaybackPanel');
    return { default: module.StudioPlaybackPanel };
});

interface StudioPanelProps {
    onClose: () => void;
    nodes: FlowNode[];
    edges: FlowEdge[];
    onApply: (nodes: FlowNode[], edges: FlowEdge[]) => void;
    onAIGenerate: (prompt: string, imageBase64?: string) => Promise<void>;
    onCodeAnalysis?: (code: string, language: SupportedLanguage) => Promise<void>;
    isGenerating: boolean;
    chatMessages: ChatMessage[];
    onClearChat: () => void;
    activeTab: StudioTab;
    onTabChange: (tab: StudioTab) => void;
    codeMode: StudioCodeMode;
    onCodeModeChange: (mode: StudioCodeMode) => void;
    playback: {
        currentStepIndex: number;
        totalSteps: number;
        isPlaying: boolean;
        onStartPlayback: () => void;
        onPlayPause: () => void;
        onStop: () => void;
        onScrubToStep: (index: number) => void;
        onNext: () => void;
        onPrev: () => void;
        playbackSpeed: number;
        onPlaybackSpeedChange: (durationMs: number) => void;
    };
}

export function StudioPanel({
    onClose,
    nodes,
    edges,
    onApply,
    onAIGenerate,
    onCodeAnalysis,
    isGenerating,
    chatMessages,
    onClearChat,
    activeTab,
    onTabChange,
    codeMode,
    onCodeModeChange,
    playback,
}: StudioPanelProps): React.ReactElement {
    const studioTabs = [
        { id: 'ai', label: 'FlowPilot', icon: WandSparkles },
        { id: 'code', label: 'Code', icon: Code2 },
        ...(ROLLOUT_FLAGS.playbackStudioV1 ? [{ id: 'playback', label: 'Playback', icon: ListVideo }] : []),
    ] as const;

    return (
        <SidebarShell>
            <SidebarHeader
                title="Studio"
                onClose={onClose}
            />

            <div className="border-b border-slate-100 bg-[var(--brand-surface)] px-4 py-2.5">
                <SidebarSegmentedTabs
                    tabs={studioTabs.map(({ id, label, icon: Icon }) => ({
                        id,
                        label,
                        icon: <Icon className="h-3.5 w-3.5" />,
                    }))}
                    activeTab={activeTab}
                    onTabChange={(tab) => onTabChange(tab as StudioTab)}
                />
            </div>

            <SidebarBody>
                {activeTab === 'ai' ? (
                    <Suspense fallback={null}>
                        <LazyStudioAIPanel
                            onAIGenerate={onAIGenerate}
                            onCodeAnalysis={onCodeAnalysis}
                            isGenerating={isGenerating}
                            chatMessages={chatMessages}
                            onClearChat={onClearChat}
                        />
                    </Suspense>
                ) : activeTab === 'code' ? (
                    <Suspense fallback={null}>
                        <LazyStudioCodePanel
                            nodes={nodes}
                            edges={edges}
                            onApply={onApply}
                            mode={codeMode}
                            onModeChange={onCodeModeChange}
                        />
                    </Suspense>
                ) : (
                    <Suspense fallback={null}>
                        <LazyStudioPlaybackPanel
                            nodes={nodes}
                            edges={edges}
                            currentStepIndex={playback.currentStepIndex}
                            totalSteps={playback.totalSteps}
                            isPlaying={playback.isPlaying}
                            onStartPlayback={playback.onStartPlayback}
                            onPlayPause={playback.onPlayPause}
                            onStop={playback.onStop}
                            onScrubToStep={playback.onScrubToStep}
                            onNext={playback.onNext}
                            onPrev={playback.onPrev}
                            playbackSpeed={playback.playbackSpeed}
                            onPlaybackSpeedChange={playback.onPlaybackSpeedChange}
                        />
                    </Suspense>
                )}
            </SidebarBody>
        </SidebarShell>
    );
}
