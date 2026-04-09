import { describe, expect, it } from 'vitest';
import { buildResolvedLayoutConfiguration } from './options';

describe('buildResolvedLayoutConfiguration', () => {
  it('tightens import spacing for compact short-label diagrams', () => {
    const config = buildResolvedLayoutConfiguration({
      direction: 'TB',
      spacing: 'compact',
      contentDensity: 'compact',
      diagramType: 'flowchart',
      source: 'import',
    });

    expect(config.dims.nodeNode).toBe('26');
    expect(config.dims.nodeLayer).toBe('42');
  });

  it('keeps architecture diagrams from collapsing below readable spacing', () => {
    const config = buildResolvedLayoutConfiguration({
      direction: 'TB',
      spacing: 'compact',
      contentDensity: 'compact',
      diagramType: 'architecture',
      source: 'import',
    });

    expect(config.dims.nodeNode).toBe('56');
    expect(config.dims.nodeLayer).toBe('88');
  });
});
