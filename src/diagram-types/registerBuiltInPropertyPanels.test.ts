import { describe, expect, it } from 'vitest';
import { getDiagramNodeProperties } from '@/diagram-types/core';
import { registerBuiltInPropertyPanels } from './registerBuiltInPropertyPanels';

describe('registerBuiltInPropertyPanels', () => {
  it('registers classDiagram node properties component', () => {
    registerBuiltInPropertyPanels();
    expect(getDiagramNodeProperties('classDiagram')).toBeDefined();
    expect(getDiagramNodeProperties('erDiagram')).toBeDefined();
    expect(getDiagramNodeProperties('mindmap')).toBeDefined();
    expect(getDiagramNodeProperties('journey')).toBeDefined();
    expect(getDiagramNodeProperties('architecture')).toBeDefined();
  });
});
