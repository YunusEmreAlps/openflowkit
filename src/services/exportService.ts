import { Node, Edge } from 'reactflow';

const sanitizeLabel = (label: string) => {
  return label.replace(/['"()]/g, '').trim() || 'Node';
};

const sanitizeId = (id: string) => {
  return id.replace(/[-]/g, '_');
};

function normalizeArchitectureDirection(direction: string | undefined): '-->' | '<--' | '<-->' {
  if (direction === '<--' || direction === '<-->') return direction;
  return '-->';
}

function normalizeArchitectureSide(side: string | undefined): 'L' | 'R' | 'T' | 'B' | undefined {
  if (!side) return undefined;
  const normalized = side.trim().toUpperCase();
  if (normalized === 'L' || normalized === 'R' || normalized === 'T' || normalized === 'B') {
    return normalized;
  }
  return undefined;
}

function handleIdToSide(handleId: string | null | undefined): 'L' | 'R' | 'T' | 'B' | undefined {
  if (!handleId) return undefined;
  const normalized = handleId.toLowerCase();
  if (normalized === 'left') return 'L';
  if (normalized === 'right') return 'R';
  if (normalized === 'top') return 'T';
  if (normalized === 'bottom') return 'B';
  return undefined;
}

function toArchitectureMermaid(nodes: Node[], edges: Edge[]): string {
  const lines: string[] = ['architecture-beta'];

  nodes.forEach((node) => {
    const id = sanitizeId(node.id);
    const label = sanitizeLabel(node.data.label);
    const kind = (node.data.archResourceType || 'service').toLowerCase();
    const parent = node.data.archBoundaryId ? sanitizeId(node.data.archBoundaryId) : '';
    const icon = node.data.archProvider && node.data.archProvider !== 'custom' ? `(${sanitizeLabel(node.data.archProvider)})` : '';
    const suffix = parent ? ` in ${parent}` : '';

    if (kind === 'group') {
      lines.push(`    group ${id}[${label}]`);
      return;
    }

    if (kind === 'junction') {
      lines.push(`    junction ${id}${icon}[${label}]${suffix}`);
      return;
    }

    lines.push(`    service ${id}${icon}[${label}]${suffix}`);
  });

  edges.forEach((edge) => {
    const source = sanitizeId(edge.source);
    const target = sanitizeId(edge.target);
    const edgeData = edge.data as {
      archProtocol?: string;
      archPort?: string;
      archDirection?: '-->' | '<--' | '<-->';
      archSourceSide?: 'L' | 'R' | 'T' | 'B';
      archTargetSide?: 'L' | 'R' | 'T' | 'B';
    } | undefined;
    const protocol = edgeData?.archProtocol;
    const port = edgeData?.archPort;
    const label = edge.label ? sanitizeLabel(String(edge.label)) : undefined;
    const sourceSide = normalizeArchitectureSide(edgeData?.archSourceSide) || handleIdToSide(edge.sourceHandle);
    const targetSide = normalizeArchitectureSide(edgeData?.archTargetSide) || handleIdToSide(edge.targetHandle);
    const direction = normalizeArchitectureDirection(
      edgeData?.archDirection
      || (edge.markerStart && edge.markerEnd ? '<-->' : edge.markerStart ? '<--' : '-->')
    );

    const resolvedLabel = protocol
      ? `${sanitizeLabel(protocol).toUpperCase()}${port ? `:${sanitizeLabel(String(port))}` : ''}`
      : label;
    const sourceToken = sourceSide ? `${source}:${sourceSide}` : source;
    const targetToken = targetSide ? `${targetSide}:${target}` : target;

    if (resolvedLabel) {
      lines.push(`    ${sourceToken} ${direction} ${targetToken} : ${resolvedLabel}`);
    } else {
      lines.push(`    ${sourceToken} ${direction} ${targetToken}`);
    }
  });

  return `${lines.join('\n')}\n`;
}

export const toMermaid = (nodes: Node[], edges: Edge[]) => {
  const architectureNodeCount = nodes.filter((node) => node.type === 'architecture').length;
  if (nodes.length > 0 && architectureNodeCount === nodes.length) {
    return toArchitectureMermaid(nodes, edges);
  }

  let mermaid = 'flowchart TD\n';

  nodes.forEach((node) => {
    const label = sanitizeLabel(node.data.label);
    const id = sanitizeId(node.id);
    let shapeStart = '[';
    let shapeEnd = ']';

    const shape = node.data.shape || 'rounded';
    const type = node.type;

    if (shape === 'diamond') { shapeStart = '{'; shapeEnd = '}'; }
    else if (shape === 'hexagon') { shapeStart = '{{'; shapeEnd = '}}'; }
    else if (shape === 'cylinder') { shapeStart = '[('; shapeEnd = ')]'; }
    else if (shape === 'ellipse') { shapeStart = '(['; shapeEnd = '])'; }
    else if (shape === 'circle') { shapeStart = '(('; shapeEnd = '))'; }
    else if (shape === 'parallelogram') { shapeStart = '>'; shapeEnd = ']'; } // asymmetric
    // Fallback based on type if no specific shape
    else if (type === 'decision') { shapeStart = '{'; shapeEnd = '}'; }
    else if (type === 'start' || type === 'end') { shapeStart = '(['; shapeEnd = '])'; }

    mermaid += `    ${id}${shapeStart}"${label}"${shapeEnd}\n`;
  });

  edges.forEach((edge) => {
    const source = sanitizeId(edge.source);
    const target = sanitizeId(edge.target);
    if (edge.label) {
      const label = sanitizeLabel(edge.label as string);
      mermaid += `    ${source} -->|"${label}"| ${target}\n`;
    } else {
      mermaid += `    ${source} --> ${target}\n`;
    }
  });

  return mermaid;
};

export const toPlantUML = (nodes: Node[], edges: Edge[]) => {
  let plantuml = '@startuml\n\n';

  nodes.forEach((node) => {
    const label = sanitizeLabel(node.data.label);
    const id = sanitizeId(node.id);
    const shape = node.data.shape;
    let type = 'rectangle';

    if (shape === 'diamond') type = 'diamond';
    else if (shape === 'cylinder') type = 'database';
    else if (shape === 'circle') type = 'circle';
    else if (shape === 'hexagon') type = 'hexagon';
    else if (shape === 'ellipse') type = 'usecase';
    else if (shape === 'parallelogram') type = 'card'; // closest mapping
    // Fallback
    else if (node.type === 'decision') type = 'diamond';
    else if (node.type === 'start' || node.type === 'end') type = 'circle';
    else if (node.type === 'custom') type = 'component';

    plantuml += `${type} "${label}" as ${id}\n`;
  });

  plantuml += '\n';

  edges.forEach((edge) => {
    const source = sanitizeId(edge.source);
    const target = sanitizeId(edge.target);
    const label = edge.label ? ` : ${sanitizeLabel(edge.label as string)}` : '';
    plantuml += `${source} --> ${target}${label}\n`;
  });

  plantuml += '\n@enduml';
  return plantuml;
};
