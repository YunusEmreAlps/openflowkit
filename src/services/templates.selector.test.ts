import { describe, expect, it } from 'vitest';
import { FLOW_TEMPLATES, getFlowTemplates } from './templates';

describe('template selector', () => {
    it('returns the curated registry-backed templates when the feature flag path is disabled', () => {
        expect(getFlowTemplates(false)).toEqual(FLOW_TEMPLATES);
    });

    it('returns the curated registry-backed templates when the feature flag path is enabled', () => {
        const templates = getFlowTemplates(true);
        const ids = templates.map((template) => template.id);

        expect(ids).toHaveLength(20);
        expect(ids).toContain('flow-release-train');
        expect(ids).toContain('aws-security-lake');
        expect(ids).toContain('azure-data-estate');
    });
});
