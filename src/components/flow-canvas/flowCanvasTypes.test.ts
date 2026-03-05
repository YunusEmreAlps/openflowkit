import { describe, expect, it } from 'vitest';
import { flowCanvasNodeTypes } from './flowCanvasTypes';

describe('flowCanvasNodeTypes', () => {
  it('registers mindmap node renderer', () => {
    expect(flowCanvasNodeTypes.mindmap).toBeDefined();
  });

  it('registers architecture node renderer', () => {
    expect(flowCanvasNodeTypes.architecture).toBeDefined();
  });

  it('registers journey node renderer', () => {
    expect(flowCanvasNodeTypes.journey).toBeDefined();
  });
});
