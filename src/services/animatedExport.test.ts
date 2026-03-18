import { describe, expect, it } from 'vitest';
import { buildAnimatedExportPlan, getAnimatedExportFileExtension, scaleToFitBounds, selectSupportedVideoMimeType } from './animatedExport';
import type { PlaybackSequence } from './playback/contracts';

const sequence: PlaybackSequence = {
  version: 1,
  steps: [
    {
      id: 'step-1',
      nodeId: 'node-1',
      durationMs: 1000,
      viewport: { duration: 800, padding: 2, minZoom: 0.5, maxZoom: 1.5 },
    },
  ],
};

describe('animated export helpers', () => {
  it('scales large frames down to the preset maximum dimension', () => {
    expect(scaleToFitBounds(2000, 1000, 1000)).toEqual({ width: 1000, height: 500 });
  });

  it('builds a GIF export plan with estimated size', () => {
    const plan = buildAnimatedExportPlan({
      kind: 'gif',
      width: 1800,
      height: 900,
      sequence,
    });

    expect(plan.preset.kind).toBe('gif');
    expect(plan.frameWidth).toBeLessThanOrEqual(960);
    expect(plan.estimatedBytes).toBeGreaterThan(0);
  });

  it('chooses the first supported recorder mime type and derives file extension', () => {
    const mimeType = selectSupportedVideoMimeType({
      isTypeSupported: (candidate) => candidate === 'video/webm;codecs=vp8',
    });

    expect(mimeType).toBe('video/webm;codecs=vp8');
    expect(getAnimatedExportFileExtension(mimeType, 'video')).toBe('webm');
    expect(getAnimatedExportFileExtension('video/mp4', 'video')).toBe('mp4');
  });
});
