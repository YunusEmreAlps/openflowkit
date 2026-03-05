import type { DiagramType, FlowEdge, FlowNode } from '@/lib/types';

export interface DiagramParseResult {
  nodes: FlowNode[];
  edges: FlowEdge[];
  error?: string;
  diagnostics?: string[];
}

export interface DiagramPlugin {
  id: DiagramType;
  displayName: string;
  parseMermaid: (input: string) => DiagramParseResult;
}

