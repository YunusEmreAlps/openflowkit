import { describe, expect, it } from 'vitest';
import { getDiagramPlugin, listDiagramPlugins } from '@/diagram-types/core';
import { registerBuiltInDiagramPlugins } from './registerBuiltInPlugins';

describe('registerBuiltInDiagramPlugins', () => {
  it('registers flowchart plugin', () => {
    registerBuiltInDiagramPlugins();

    const flowchart = getDiagramPlugin('flowchart');
    const classDiagram = getDiagramPlugin('classDiagram');
    const erDiagram = getDiagramPlugin('erDiagram');
    const mindmap = getDiagramPlugin('mindmap');
    const journey = getDiagramPlugin('journey');
    const architecture = getDiagramPlugin('architecture');
    expect(flowchart).toBeDefined();
    expect(flowchart?.id).toBe('flowchart');
    expect(classDiagram).toBeDefined();
    expect(classDiagram?.id).toBe('classDiagram');
    expect(erDiagram).toBeDefined();
    expect(erDiagram?.id).toBe('erDiagram');
    expect(mindmap).toBeDefined();
    expect(mindmap?.id).toBe('mindmap');
    expect(journey).toBeDefined();
    expect(journey?.id).toBe('journey');
    expect(architecture).toBeDefined();
    expect(architecture?.id).toBe('architecture');
    expect(listDiagramPlugins().some((candidate) => candidate.id === 'flowchart')).toBe(true);
    expect(listDiagramPlugins().some((candidate) => candidate.id === 'classDiagram')).toBe(true);
    expect(listDiagramPlugins().some((candidate) => candidate.id === 'erDiagram')).toBe(true);
    expect(listDiagramPlugins().some((candidate) => candidate.id === 'mindmap')).toBe(true);
    expect(listDiagramPlugins().some((candidate) => candidate.id === 'journey')).toBe(true);
    expect(listDiagramPlugins().some((candidate) => candidate.id === 'architecture')).toBe(true);
  });

  it('is idempotent', () => {
    registerBuiltInDiagramPlugins();
    registerBuiltInDiagramPlugins();

    const flowchartPlugins = listDiagramPlugins().filter((candidate) => candidate.id === 'flowchart');
    const classPlugins = listDiagramPlugins().filter((candidate) => candidate.id === 'classDiagram');
    const erPlugins = listDiagramPlugins().filter((candidate) => candidate.id === 'erDiagram');
    const mindmapPlugins = listDiagramPlugins().filter((candidate) => candidate.id === 'mindmap');
    const journeyPlugins = listDiagramPlugins().filter((candidate) => candidate.id === 'journey');
    const architecturePlugins = listDiagramPlugins().filter((candidate) => candidate.id === 'architecture');
    expect(flowchartPlugins).toHaveLength(1);
    expect(classPlugins).toHaveLength(1);
    expect(erPlugins).toHaveLength(1);
    expect(mindmapPlugins).toHaveLength(1);
    expect(journeyPlugins).toHaveLength(1);
    expect(architecturePlugins).toHaveLength(1);
  });
});
