import { describe, expect, it } from 'vitest';
import type { Edge, Node } from 'reactflow';
import { toMermaid } from './exportService';

describe('toMermaid', () => {
  it('exports architecture-only diagrams as architecture-beta', () => {
    const nodes: Node[] = [
      {
        id: 'cloud-main',
        type: 'architecture',
        position: { x: 0, y: 0 },
        data: { label: 'Cloud', archResourceType: 'group' },
      },
      {
        id: 'api',
        type: 'architecture',
        position: { x: 300, y: 0 },
        data: { label: 'API', archResourceType: 'service', archProvider: 'aws', archBoundaryId: 'cloud-main' },
      },
      {
        id: 'db',
        type: 'architecture',
        position: { x: 600, y: 0 },
        data: { label: 'Database', archResourceType: 'service', archBoundaryId: 'cloud-main' },
      },
    ];
    const edges: Edge[] = [
      {
        id: 'e1',
        source: 'api',
        target: 'db',
        data: { archProtocol: 'HTTPS', archPort: '443', archDirection: '<-->', archSourceSide: 'R', archTargetSide: 'L' },
      },
    ];

    const output = toMermaid(nodes, edges);
    expect(output).toContain('architecture-beta');
    expect(output).toContain('group cloud_main[Cloud]');
    expect(output).toContain('service api(aws)[API] in cloud_main');
    expect(output).toContain('api:R <--> L:db : HTTPS:443');
  });

  it('keeps flowchart export path for mixed or non-architecture nodes', () => {
    const nodes: Node[] = [
      { id: 'a', type: 'process', position: { x: 0, y: 0 }, data: { label: 'A' } },
      { id: 'b', type: 'architecture', position: { x: 200, y: 0 }, data: { label: 'B', archResourceType: 'service' } },
    ];
    const edges: Edge[] = [{ id: 'e1', source: 'a', target: 'b' }];

    const output = toMermaid(nodes, edges);
    expect(output.startsWith('flowchart TD')).toBe(true);
  });

  it('derives architecture side qualifiers from handles when semantic side metadata is absent', () => {
    const nodes: Node[] = [
      { id: 'api', type: 'architecture', position: { x: 0, y: 0 }, data: { label: 'API', archResourceType: 'service' } },
      { id: 'db', type: 'architecture', position: { x: 200, y: 0 }, data: { label: 'DB', archResourceType: 'service' } },
    ];
    const edges: Edge[] = [
      {
        id: 'e1',
        source: 'api',
        target: 'db',
        sourceHandle: 'top',
        targetHandle: 'bottom',
        data: { archProtocol: 'TCP', archDirection: '-->' },
      },
    ];

    const output = toMermaid(nodes, edges);
    expect(output).toContain('api:T --> B:db : TCP');
  });

  it('normalizes architecture direction and side casing during export', () => {
    const nodes: Node[] = [
      { id: 'api', type: 'architecture', position: { x: 0, y: 0 }, data: { label: 'API', archResourceType: 'service' } },
      { id: 'db', type: 'architecture', position: { x: 200, y: 0 }, data: { label: 'DB', archResourceType: 'service' } },
    ];
    const edges: Edge[] = [
      {
        id: 'e1',
        source: 'api',
        target: 'db',
        data: {
          archDirection: '<->' as unknown as '-->' | '<--' | '<-->',
          archSourceSide: 'l' as unknown as 'L' | 'R' | 'T' | 'B',
          archTargetSide: 'r' as unknown as 'L' | 'R' | 'T' | 'B',
          archProtocol: 'https',
          archPort: '443',
        },
      },
    ];

    const output = toMermaid(nodes, edges);
    expect(output).toContain('api:L --> R:db : HTTPS:443');
  });
});
