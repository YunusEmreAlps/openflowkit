import { createId } from '@/lib/id';
import type { FlowEdge, FlowNode } from '@/lib/types';
import type { DiagramPlugin } from '@/diagram-types/core';

interface EntityRecord {
  id: string;
  label: string;
  fields: string[];
}

interface RelationRecord {
  left: string;
  relation: string;
  right: string;
  label?: string;
}

const ENTITY_ID_PATTERN = '[A-Za-z_][\\w.]*';
const ER_RELATION_TOKENS = [
  '||--||',
  '||--o{',
  '||--|{',
  '}o--||',
  '}|--||',
  '}o..o{',
  '}|..|{',
  '}o--o{',
  '}|--|{',
  '}o..||',
  '}|..||',
  '||..o{',
  '||..|{',
];

function createEmptyEntity(id: string): EntityRecord {
  return {
    id,
    label: id,
    fields: [],
  };
}

function parseRelation(line: string): RelationRecord | null {
  const relationTokenPattern = ER_RELATION_TOKENS
    .slice()
    .sort((left, right) => right.length - left.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const match = line.match(
    new RegExp(`^(${ENTITY_ID_PATTERN})\\s+(${relationTokenPattern})\\s+(${ENTITY_ID_PATTERN})(?:\\s*:\\s*(.+))?$`)
  );
  if (!match) return null;

  return {
    left: match[1],
    relation: match[2],
    right: match[3],
    label: match[4]?.trim(),
  };
}

function parseEntityInline(line: string): string | null {
  const match = line.match(new RegExp(`^(${ENTITY_ID_PATTERN})\\s*\\{\\s*$`));
  return match ? match[1] : null;
}

function parseERDiagram(input: string): { nodes: FlowNode[]; edges: FlowEdge[]; error?: string; diagnostics?: string[] } {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const entities = new Map<string, EntityRecord>();
  const relations: RelationRecord[] = [];
  const diagnostics: string[] = [];

  let hasHeader = false;
  let activeEntity: EntityRecord | null = null;
  let activeEntityLine = -1;

  for (const [index, rawLine] of lines.entries()) {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line || line.startsWith('%%')) continue;

    if (/^erDiagram\b/i.test(line)) {
      hasHeader = true;
      continue;
    }

    if (!hasHeader) continue;

    if (activeEntity) {
      if (line === '}') {
        activeEntity = null;
        activeEntityLine = -1;
        continue;
      }
      activeEntity.fields.push(line);
      continue;
    }

    const entityId = parseEntityInline(line);
    if (entityId) {
      const existing = entities.get(entityId) || createEmptyEntity(entityId);
      entities.set(entityId, existing);
      activeEntity = existing;
      activeEntityLine = lineNumber;
      continue;
    }

    const relation = parseRelation(line);
    if (relation) {
      relations.push(relation);
      if (!entities.has(relation.left)) {
        entities.set(relation.left, createEmptyEntity(relation.left));
      }
      if (!entities.has(relation.right)) {
        entities.set(relation.right, createEmptyEntity(relation.right));
      }
      continue;
    }

    if (/^[A-Za-z_][\w.]*\s*\{/.test(line) || /^entity\s+/i.test(line)) {
      diagnostics.push(`Invalid entity declaration at line ${lineNumber}: "${line}"`);
      continue;
    }

    if (/(?:\|\||\|o|o\{|}\|}|}\|)\s*(?:--|\.\.)\s*(?:\|\||\|o|o\{|\|\{|}\|}|}\|)/.test(line) || /->|<->|=>|<=/.test(line)) {
      diagnostics.push(`Invalid erDiagram relation syntax at line ${lineNumber}: "${line}"`);
      continue;
    }

    diagnostics.push(`Unrecognized erDiagram line at line ${lineNumber}: "${line}"`);
  }

  if (activeEntity && activeEntityLine > 0) {
    diagnostics.push(`Unclosed entity block started at line ${activeEntityLine}.`);
  }

  if (!hasHeader) {
    return {
      nodes: [],
      edges: [],
      error: 'Missing erDiagram header.',
    };
  }

  if (entities.size === 0) {
    return {
      nodes: [],
      edges: [],
      error: 'No valid entities found.',
    };
  }

  const entityList = Array.from(entities.values());
  const nodes: FlowNode[] = entityList.map((entity, index) => ({
    id: entity.id,
    type: 'er_entity',
    position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 220 },
    data: {
      label: entity.label,
      color: 'slate',
      shape: 'rectangle',
      erFields: entity.fields,
    },
  }));

  const edges: FlowEdge[] = relations.map((relation, index) => ({
    id: createId(`e-er-${index}`),
    source: relation.left,
    target: relation.right,
    label: relation.label || relation.relation,
    type: 'smoothstep',
  }));

  return diagnostics.length > 0 ? { nodes, edges, diagnostics } : { nodes, edges };
}

export const ER_DIAGRAM_PLUGIN: DiagramPlugin = {
  id: 'erDiagram',
  displayName: 'ER Diagram',
  parseMermaid: parseERDiagram,
};
