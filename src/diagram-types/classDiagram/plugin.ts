import { createId } from '@/lib/id';
import type { FlowEdge, FlowNode } from '@/lib/types';
import type { DiagramPlugin } from '@/diagram-types/core';

interface ClassRecord {
  id: string;
  label: string;
  stereotype?: string;
  attributes: string[];
  methods: string[];
}

interface RelationRecord {
  source: string;
  target: string;
  relation: string;
  label?: string;
}

const CLASS_ID_PATTERN = '[A-Za-z_][\\w.]*';
const CLASS_RELATION_TOKENS = [
  '<|--',
  '--|>',
  '*--',
  '--*',
  'o--',
  '--o',
  '..>',
  '<..',
  '<--',
  '-->',
  '<-->',
  '..',
  '--',
];

function createEmptyClass(id: string): ClassRecord {
  return {
    id,
    label: id,
    attributes: [],
    methods: [],
  };
}

function parseClassBodyLine(line: string, record: ClassRecord): void {
  const trimmed = line.trim();
  if (!trimmed) return;

  if (/^\s*<<.+>>\s*$/i.test(trimmed)) {
    record.stereotype = trimmed.replace(/^<<\s*/, '').replace(/\s*>>$/, '').trim();
    return;
  }

  if (/\(.*\)/.test(trimmed)) {
    record.methods.push(trimmed);
    return;
  }

  record.attributes.push(trimmed);
}

function parseRelation(line: string): RelationRecord | null {
  const relationTokenPattern = CLASS_RELATION_TOKENS
    .slice()
    .sort((left, right) => right.length - left.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const relationMatch = line.match(
    new RegExp(`^(${CLASS_ID_PATTERN})\\s+(${relationTokenPattern})\\s+(${CLASS_ID_PATTERN})(?:\\s*:\\s*(.+))?$`)
  );
  if (!relationMatch) return null;

  return {
    source: relationMatch[1],
    relation: relationMatch[2],
    target: relationMatch[3],
    label: relationMatch[4]?.trim(),
  };
}

function parseClassDiagram(input: string): { nodes: FlowNode[]; edges: FlowEdge[]; error?: string; diagnostics?: string[] } {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const classes = new Map<string, ClassRecord>();
  const relations: RelationRecord[] = [];
  const diagnostics: string[] = [];

  let hasHeader = false;
  let activeClass: ClassRecord | null = null;
  let activeClassLine = -1;

  for (const [index, rawLine] of lines.entries()) {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line || line.startsWith('%%')) continue;

    if (/^classDiagram\b/i.test(line)) {
      hasHeader = true;
      continue;
    }

    if (!hasHeader) continue;

    if (activeClass) {
      if (line === '}') {
        activeClass = null;
        activeClassLine = -1;
        continue;
      }
      parseClassBodyLine(line, activeClass);
      continue;
    }

    const inlineBlock = line.match(new RegExp(`^class\\s+(${CLASS_ID_PATTERN})\\s*\\{\\s*(.*?)\\s*\\}$`));
    if (inlineBlock) {
      const id = inlineBlock[1];
      const existing = classes.get(id) || createEmptyClass(id);
      classes.set(id, existing);
      const members = inlineBlock[2]
        .split(';')
        .map((member) => member.trim())
        .filter(Boolean);
      members.forEach((member) => parseClassBodyLine(member, existing));
      continue;
    }

    const blockStart = line.match(new RegExp(`^class\\s+(${CLASS_ID_PATTERN})\\s*\\{\\s*$`));
    if (blockStart) {
      const id = blockStart[1];
      const existing = classes.get(id) || createEmptyClass(id);
      classes.set(id, existing);
      activeClass = existing;
      activeClassLine = lineNumber;
      continue;
    }

    const classWithStereotype = line.match(new RegExp(`^class\\s+(${CLASS_ID_PATTERN})\\s*<<\\s*(.+?)\\s*>>\\s*$`));
    if (classWithStereotype) {
      const id = classWithStereotype[1];
      const existing = classes.get(id) || createEmptyClass(id);
      existing.stereotype = classWithStereotype[2];
      classes.set(id, existing);
      continue;
    }

    const standaloneClass = line.match(new RegExp(`^class\\s+(${CLASS_ID_PATTERN})\\s*$`));
    if (standaloneClass) {
      const id = standaloneClass[1];
      if (!classes.has(id)) {
        classes.set(id, createEmptyClass(id));
      }
      continue;
    }

    const classMemberInline = line.match(new RegExp(`^(${CLASS_ID_PATTERN})\\s*:\\s*(.+)$`));
    if (classMemberInline) {
      const id = classMemberInline[1];
      const member = classMemberInline[2].trim();
      const existing = classes.get(id) || createEmptyClass(id);
      if (/\(.*\)/.test(member)) {
        existing.methods.push(member);
      } else {
        existing.attributes.push(member);
      }
      classes.set(id, existing);
      continue;
    }

    const relation = parseRelation(line);
    if (relation) {
      relations.push(relation);
      if (!classes.has(relation.source)) {
        classes.set(relation.source, createEmptyClass(relation.source));
      }
      if (!classes.has(relation.target)) {
        classes.set(relation.target, createEmptyClass(relation.target));
      }
      continue;
    }

    if (/^class\s+/i.test(line)) {
      diagnostics.push(`Invalid class declaration at line ${lineNumber}: "${line}"`);
      continue;
    }

    if (/(<\|--|--\|>|<-->|<--|-->|--|\.\.|->|<-|<->|=>|<=)/.test(line)) {
      diagnostics.push(`Invalid class relation syntax at line ${lineNumber}: "${line}"`);
      continue;
    }

    diagnostics.push(`Unrecognized classDiagram line at line ${lineNumber}: "${line}"`);
  }

  if (activeClass && activeClassLine > 0) {
    diagnostics.push(`Unclosed class block started at line ${activeClassLine}.`);
  }

  if (!hasHeader) {
    return {
      nodes: [],
      edges: [],
      error: 'Missing classDiagram header.',
    };
  }

  if (classes.size === 0) {
    return {
      nodes: [],
      edges: [],
      error: 'No valid classes found.',
    };
  }

  const classList = Array.from(classes.values());
  const nodes: FlowNode[] = classList.map((record, index) => ({
    id: record.id,
    type: 'class',
    position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 220 },
    data: {
      label: record.label,
      color: 'slate',
      shape: 'rectangle',
      classStereotype: record.stereotype,
      classAttributes: record.attributes,
      classMethods: record.methods,
    },
  }));

  const edges: FlowEdge[] = relations.map((relation, index) => ({
    id: createId(`e-class-${index}`),
    source: relation.source,
    target: relation.target,
    label: relation.label || relation.relation,
    type: 'smoothstep',
  }));

  return diagnostics.length > 0 ? { nodes, edges, diagnostics } : { nodes, edges };
}

export const CLASS_DIAGRAM_PLUGIN: DiagramPlugin = {
  id: 'classDiagram',
  displayName: 'Class Diagram',
  parseMermaid: parseClassDiagram,
};
