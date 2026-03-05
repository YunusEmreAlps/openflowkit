export type RolloutFlagKey =
    | 'historyModelV2'
    | 'visualQualityV2'
    | 'mermaidSyncV1'
    | 'familyPluginV1'
    | 'reactFlowV12Migration';

interface RolloutFlagDefinition {
    key: RolloutFlagKey;
    envVar: string;
    defaultEnabled: boolean;
    description: string;
}

const ROLLOUT_FLAG_DEFINITIONS: Record<RolloutFlagKey, RolloutFlagDefinition> = {
    historyModelV2: {
        key: 'historyModelV2',
        envVar: 'VITE_HISTORY_MODEL_V2',
        defaultEnabled: true,
        description: 'Store-level history model v2 path',
    },
    visualQualityV2: {
        key: 'visualQualityV2',
        envVar: 'VITE_VISUAL_QUALITY_V2',
        defaultEnabled: false,
        description: 'Phase 0 visual quality rollout',
    },
    mermaidSyncV1: {
        key: 'mermaidSyncV1',
        envVar: 'VITE_MERMAID_SYNC_V1',
        defaultEnabled: false,
        description: 'Bidirectional Mermaid code panel and diagnostics',
    },
    familyPluginV1: {
        key: 'familyPluginV1',
        envVar: 'VITE_FAMILY_PLUGIN_V1',
        defaultEnabled: false,
        description: 'Diagram family plugin routing rollout',
    },
    reactFlowV12Migration: {
        key: 'reactFlowV12Migration',
        envVar: 'VITE_REACTFLOW_V12_MIGRATION',
        defaultEnabled: false,
        description: 'React Flow v12 migration path',
    },
};

function readBooleanEnvFlag(envValue: string | undefined, defaultEnabled: boolean): boolean {
    if (envValue === '1') {
        return true;
    }
    if (envValue === '0') {
        return false;
    }
    return defaultEnabled;
}

export function isRolloutFlagEnabled(key: RolloutFlagKey): boolean {
    const definition = ROLLOUT_FLAG_DEFINITIONS[key];
    const envValue = import.meta.env[definition.envVar as keyof ImportMetaEnv] as string | undefined;
    return readBooleanEnvFlag(envValue, definition.defaultEnabled);
}

export const ROLLOUT_FLAGS: Record<RolloutFlagKey, boolean> = {
    historyModelV2: isRolloutFlagEnabled('historyModelV2'),
    visualQualityV2: isRolloutFlagEnabled('visualQualityV2'),
    mermaidSyncV1: isRolloutFlagEnabled('mermaidSyncV1'),
    familyPluginV1: isRolloutFlagEnabled('familyPluginV1'),
    reactFlowV12Migration: isRolloutFlagEnabled('reactFlowV12Migration'),
};

export function getRolloutFlagDefinitions(): RolloutFlagDefinition[] {
    return Object.values(ROLLOUT_FLAG_DEFINITIONS);
}

