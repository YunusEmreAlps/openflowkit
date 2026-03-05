import type { DiagramType } from '@/lib/types';
import { parseMermaid, type ParseResult } from '@/lib/mermaidParser';
import { getDiagramPlugin } from '@/diagram-types/core';
import { registerBuiltInDiagramPlugins } from '@/diagram-types/registerBuiltInPlugins';
import { detectMermaidDiagramType } from './detectDiagramType';

export interface MermaidDispatchParseResult extends ParseResult {
  diagramType?: DiagramType;
  diagnostics?: string[];
}

export interface ParseMermaidByTypeOptions {
  architectureStrictMode?: boolean;
}

const SUPPORTED_MERMAID_FAMILIES: DiagramType[] = ['flowchart', 'stateDiagram', 'classDiagram', 'erDiagram', 'mindmap', 'journey', 'architecture'];

function getUnsupportedTypeError(diagramType: DiagramType): string {
  return `Mermaid "${diagramType}" is not supported yet in editable mode. Supported families: flowchart, stateDiagram, classDiagram, erDiagram, mindmap, journey, architecture.`;
}

function applyArchitectureStrictMode(result: MermaidDispatchParseResult): MermaidDispatchParseResult {
  const diagnostics = Array.isArray(result.diagnostics) ? result.diagnostics : [];
  const strictViolations = diagnostics.filter((message) => (
    message.startsWith('Invalid architecture ')
    || message.startsWith('Duplicate architecture node id')
    || message.startsWith('Recovered implicit service node')
  ));

  if (strictViolations.length === 0) {
    return result;
  }

  return {
    ...result,
    nodes: [],
    edges: [],
    error: `Architecture strict mode rejected ${strictViolations.length} validation issue(s).`,
  };
}

export function parseMermaidByType(
  input: string,
  options: ParseMermaidByTypeOptions = {}
): MermaidDispatchParseResult {
  registerBuiltInDiagramPlugins();

  const detectedType = detectMermaidDiagramType(input);

  if (!detectedType) {
    return {
      nodes: [],
      edges: [],
      error: 'Missing chart type declaration. Start with "flowchart TD", "stateDiagram-v2", or another Mermaid diagram type header.',
    };
  }

  if (!SUPPORTED_MERMAID_FAMILIES.includes(detectedType)) {
    return {
      nodes: [],
      edges: [],
      diagramType: detectedType,
      error: getUnsupportedTypeError(detectedType),
    };
  }

  if (detectedType !== 'stateDiagram') {
    const plugin = getDiagramPlugin(detectedType);
    if (plugin) {
      const parsed = {
        ...plugin.parseMermaid(input),
        diagramType: detectedType,
      };
      if (detectedType === 'architecture' && options.architectureStrictMode) {
        return applyArchitectureStrictMode(parsed);
      }
      return parsed;
    }

    return {
      nodes: [],
      edges: [],
      diagramType: detectedType,
      error: `Mermaid "${detectedType}" plugin is not registered.`,
    };
  }

  // Compatibility adapter for legacy state-diagram parsing until state plugin lands.
  return {
    ...parseMermaid(input),
    diagramType: detectedType,
  };
}
