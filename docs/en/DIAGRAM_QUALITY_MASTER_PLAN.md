# OpenFlowKit — Diagram Quality Master Plan
**Version:** 2026-03-05 | **Status:** Planning

> **Goal**: Make OpenFlowKit diagrams better-looking, clearer, and more accurate than raw Mermaid output — the same quality bar as Whimsical, Lucidchart, and FigJam — with 100% code↔canvas fidelity and zero broken outputs.

---

## 1. Honest State of Play (Full Inventory)

### ✅ What Already Exists (Don't Rebuild)

| Feature | Where | Quality |
|---|---|---|
| ClassNode — table renderer with inline attr/method edit | `ClassNode.tsx` | Good foundation, needs polish |
| EntityNode — ER field list with inline edit | `EntityNode.tsx` | Good foundation, needs PK/FK column |
| ArchitectureNode — provider/resource/environment badges | `ArchitectureNode.tsx` | Solid |
| JourneyNode — section label, score badge, actor, inline edit | `JourneyNode.tsx` | Complete |
| MindmapNode — root/child differentiation | `MindmapNode.tsx` | Minimal — needs depth-based color |
| SectionNode — dashed group container, colored, resizable | `SectionNode.tsx` | Good |
| SwimlaneNode | `SwimlaneNode.tsx` | Present |
| WireframeNodes — Button, Input, Image, Icon | `WireframeNodes.tsx` | Present |
| 16 node types registered | `flowCanvasTypes.tsx` | ✅ |
| Smart edge routing (geometric handle assignment) | `smartEdgeRouting.ts` | Very solid — 335 lines |
| Self-loop edges, parallel edge offset | `pathUtils.ts` | Good |
| Bezier + SmoothStep + Step edge types | `CustomEdge.tsx` | Good |
| Draggable edge labels (path-following) | `CustomEdgeWrapper.tsx` | Good |
| Architecture edge protocol/port pill badges | `CustomEdgeWrapper.tsx` | Good |
| Edge condition display | `EdgeConditionSection.tsx` | Present |
| ELK.js hierarchical layout | `elkLayout.ts` | Solid |
| Large graph safety mode | `largeGraphSafetyMode.ts` | Good |
| Mermaid → Canvas (flowchart, arch, class, ER, mindmap, journey) | `parseMermaidByType.ts` | Mostly good |

### ❌ Real Gaps Found (With File Evidence)

#### Gap 1: ALL NODES are white backgrounds — Zero visual hierarchy
**Evidence**: `theme.ts` line 21 — every color variant sets `bg: 'bg-white'`  
**Impact**: In a diagram with 15 nodes, every node looks identical at a glance. Mermaid uses fills.

#### Gap 2: Edges default to `animated: true` — Diagrams look "busy"
**Evidence**: `mermaidParser.ts` line ~27 sets `animated: true` as default  
**Impact**: Marching dashes on every connection makes the canvas look unstable. Mermaid uses static lines.

#### Gap 3: ALL handles invisible until hover — Connections feel broken
**Evidence**: `CustomNode.tsx`, `ArchitectureNode.tsx`, `JourneyNode.tsx`, `ClassNode.tsx`, `EntityNode.tsx` — all use `opacity-0 group-hover:opacity-100`  
**Impact**: Users can't see WHERE to connect. Discovered "connections not visible" complaint from this.

#### Gap 4: ClassNode/EntityNode missing semantic field formatting
**Evidence**: `ClassNode.tsx:129` — attributes rendered as raw string `font-mono`. No `+/-/#` visibility column, no type highlighting.
**Evidence**: `EntityNode.tsx:88` — ER fields as raw mono string. No PK/FK column, no type column.
**Impact**: Data is parsed and stored correctly, but the display is a raw text dump, not a UML table.

#### Gap 5: MindmapNode has no depth-based visual hierarchy
**Evidence**: `MindmapNode.tsx:13-15` — only 2 states: root (dark) vs everything-else (white). No depth-based color/size gradation.
**Impact**: A 5-level mindmap looks flat. Mermaid renders depth-based sizes.

#### Gap 6: Edge labels styled as floating tooltip boxes
**Evidence**: `CustomEdgeWrapper.tsx:151` — `bg-white px-2 py-1 rounded border border-slate-200 shadow-sm`  
**Impact**: Labels look like UI tooltips floating on top of the diagram, not like diagram annotations.

#### Gap 7: stateDiagram on legacy code path (not a plugin)
**Evidence**: `parseMermaidByType.ts` routes `stateDiagram` via legacy adapter inside `mermaidParser.ts` flowchart parser  
**Impact**: State diagrams: missing `[*]` pseudo-states, composite states, concurrent regions, note blocks.

#### Gap 8: Architecture group nesting not wired to ReactFlow `parentNode`
**Evidence**: `architecture/plugin.ts` stores `archBoundaryId` in data but never sets `parentNode` or `extent: 'parent'`  
**Impact**: Groups render as separate floating nodes, not as visual containers of their children.

#### Gap 9: Canvas → Mermaid export loses all edge style information
**Evidence**: `exportService.ts:131-133` — ALL edges become `-->` regardless of stroke width, dashes, or bidirectionality  
**Impact**: Round-trip broken. Paste thick/dashed Mermaid → export → paste again → loses all style.

#### Gap 10: No live bidirectional code editor panel — Export is clipboard only
**Evidence**: `useFlowEditorActions.ts:85-91` — `handleExportMermaid` just copies to clipboard  
**Impact**: No way to see the Mermaid representation live. No way to edit Mermaid and see canvas update.

#### Gap 11: Parser diagnostics silently ignored
**Evidence**: `FlowCanvas.tsx` — after `parseMermaidByType()` returns, `result.diagnostics` is never consulted  
**Impact**: Architecture strict mode violations, unknown node types, etc. silently produce empty diagrams with no user feedback.

#### Gap 12: Mermaid edge type variants (`.`, `==`) not parsed into visual style
**Evidence**: `mermaidParser.ts` — `==>` (thick) sets `strokeWidth: 4`, but dotted `...` and mixed variants may not be captured  
**Impact**: Pasting `A -.-> B` may not render dashed correctly.

#### Gap 13: No orthogonal (elbow) edge routing for class/ER diagrams
**Evidence**: `pathUtils.ts` — smoothstep is used but not true right-angle elbow routing  
**Impact**: Class diagrams with many relationships look messy. Lucidchart uses strict orthogonal routing.

#### Gap 14: Edge arrowhead markers missing Mermaid-specific types
**Evidence**: Only `ArrowClosed` (filled arrow) and none/undefined (no arrow). Mermaid has: open arrow, diamond, circle, cross, etc.  
**Impact**: Class diagram relationships (aggregation = diamond, composition = filled diamond, realization = open arrow) all look the same.

---

## 2. Benchmark: What The Best Tools Do That We Don't

### Figma/FigJam
- **Auto-layout frames**: nodes inside a frame auto-arrange with padding and gap constraints
- **Component instances**: can "unlink" a component to edit it independently
- **Variable fills**: color tokens that update all instances
- **Smart connector routing**: connectors avoid overlapping other nodes (obstacle avoidance)
- **Connection ports**: multiple labeled ports per node (important for class/architecture)

### Excalidraw
- **Hand-drawn visual style**: shows intentionality (not trying to be "production" — that's the feature)
- **Library panels**: drag-and-drop shape libraries
- **Freehand drawing**: sketch directly on canvas
- **Text rendering**: clean, positioned, no overflow issues

### Whimsical
- **Flow diagrams**: super clean, consistent spacing, pastel fills by default
- **Mind maps**: depth-based node size scaling (root > L1 > L2 > L3)
- **Sticky notes**: proper shadow, spacing, color
- **Templates**: strong, opinionated layout defaults by diagram type

### Lucidchart
- **UML fidelity**: full class/ER/sequence with proper notation
- **Data-linked shapes**: shapes can display live table data
- **Conditional formatting**: shape styles change based on data
- **Swim lane containers**: proper lane sizing and label positioning
- **Entity relationship markers**: crow's foot, zero-or-one, etc. on edge ends

### What We Have That Others Don't
- **AI generation** from natural language (strong differentiator)
- **Mermaid code ↔ canvas** (unique — no other canvas tool does this well)
- **Architecture-beta diagrams** with protocol/port semantics
- **Multi-tab support**
- **Large graph safety mode** (very few tools handle 500+ nodes)

---

## 3. The Master Plan

### Phase 0 — Visual Quality (2-3 days, highest user-visible impact)

#### 0.1 — Node Fill Colors
**Files**: `src/theme.ts`, `src/components/CustomNode.tsx`

Replace all `bg-white` with tinted pastel fills. Update the palette:
```typescript
// theme.ts — all colors updated
slate:   { bg: 'bg-slate-50',   border: 'border-slate-200',   iconBg: 'bg-slate-100' }
blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    iconBg: 'bg-blue-100' }
emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100' }
red:     { bg: 'bg-red-50',     border: 'border-red-200',     iconBg: 'bg-red-100' }
amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   iconBg: 'bg-amber-100' }
violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  iconBg: 'bg-violet-100' }
pink:    { bg: 'bg-pink-50',    border: 'border-pink-200',    iconBg: 'bg-pink-100' }
cyan:    { bg: 'bg-cyan-50',    border: 'border-cyan-200',    iconBg: 'bg-cyan-100' }
```
Also update `NODE_EXPORT_COLORS` to sync with the live `bg-*` classes. Currently export colors are already tinted (out of sync with live which is white) — fix the live side to match export.

**Yellow** keeps its current sticky-note treatment (`bg-yellow-100`) — that's correct.

#### 0.2 — Remove Animated Edges as Default
**Files**: `src/lib/mermaidParser.ts`, `src/index.css`

```typescript
// mermaidParser.ts — change default edges
animated: false,
style: { stroke: '#64748b', strokeWidth: 1.5 }  // was: '#94a3b8', 2
```
Also update `src/index.css:345-349`:
```css
.react-flow__edge-path {
  stroke: #64748b;    /* was #94a3b8 — slightly darker, more visible */
  stroke-width: 1.5;  /* was 2 */
}
```
Animation stays as opt-in (EdgeStyleSection toggle is already there).

#### 0.3 — Connection Handles: Always Visible at 30% Opacity
**Files**: `src/components/CustomNode.tsx`, `src/components/custom-nodes/ClassNode.tsx`, `src/components/custom-nodes/EntityNode.tsx`, `src/components/custom-nodes/MindmapNode.tsx`

Pattern to apply across ALL node files that have handles:
```tsx
// BEFORE (invisible by default)
className={`!w-3 !h-3 !bg-slate-400 !border-2 !border-white
  opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100`}

// AFTER (always visible at 30%, full on hover/select/connecting)
className={`!w-3 !h-3 !bg-slate-400 !border-2 !border-white
  transition-all duration-150
  opacity-30 group-hover:opacity-100 hover:scale-125
  [.is-connecting_&]:opacity-100
  ${selected ? 'opacity-100 scale-110' : ''}`}
```

Also add CSS in `index.css` for a larger transparent hit area using `::after`:
```css
.react-flow__handle::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
}
```

#### 0.4 — Edge Labels: Pill Style Not Floating Box
**File**: `src/components/custom-edge/CustomEdgeWrapper.tsx`

```tsx
// Line 151 — BEFORE
className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm text-xs font-medium text-slate-600 cursor-move hover:ring-2 hover:ring-indigo-500/20 active:ring-indigo-500 select-none flow-lod-secondary flow-lod-shadow"

// AFTER — pill
className="bg-white/95 px-2.5 py-0.5 rounded-full border border-slate-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-[11px] font-medium text-slate-500 cursor-move hover:border-indigo-300 hover:text-slate-700 hover:shadow-md active:ring-2 active:ring-indigo-400 select-none flow-lod-secondary flow-lod-shadow transition-all"
```

#### 0.5 — Canvas Background
**File**: `src/components/FlowCanvas.tsx`

```tsx
// BEFORE (ReactFlow default dot pattern settings — not visible in code, using defaults)
// AFTER — finer, more subtle
<Background
  variant={BackgroundVariant.Dots}
  gap={24}
  size={1}
  color="rgba(148,163,184,0.35)"
/>
```

#### 0.6 — Node Typography & Label Overflow
**File**: `src/components/CustomNode.tsx`

1. Change label font: `font-bold` → `font-semibold`, `text-sm` → `text-[13px]`
2. Add `line-clamp-3` to prevent infinite height overflow
3. Add `title={data.label}` attribute for native tooltip on hover
4. When icon present: use `flex flex-row items-center gap-2` instead of stacked column layout

#### 0.7 — Selection State: Glow Not Ring-Offset Gap
**File**: `src/components/CustomNode.tsx` (and ClassNode.tsx, EntityNode.tsx — each has hardcoded `ring-2 ring-indigo-500 ring-offset-2`)

Replace across all node files:
```tsx
// BEFORE
selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''

// AFTER — in containerStyle, not className
style={{
  ...(selected ? {
    boxShadow: '0 0 0 2px #6366f1, 0 0 12px rgba(99,102,241,0.2)',
    outline: 'none',
  } : {}),
}}
```
Also increase NodeResizer handle size from 8px → 10px and change color to match brand primary.

#### 0.8 — In-Progress Connection Line
**File**: `src/components/CustomConnectionLine.tsx`

Upgrade from basic dashed line to a smooth bezier preview with subtle drop shadow:
```tsx
// Use getBezierPath for smooth preview
// Add: filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15))
// Remove the default dashed stroke
```

---

### Phase 1 — Live Bi-Directional Mermaid Code Editor (3-4 days)

#### 1.1 — CodeEditorPanel Component
**Files**: `src/components/CodeEditorPanel.tsx` [NEW], `src/components/FlowEditor.tsx`, `src/components/Toolbar.tsx`

A slide-in panel (right side, `max-w-sm`, full height) showing live Mermaid code:

**Canvas → Code sync**:
```typescript
// Inside panel — auto-updates whenever store nodes/edges change
const mermaidCode = useMemo(
  () => toMermaid(nodes, edges, detectedDiagramType),
  [nodes, edges]
);
```

**Code → Canvas sync** (debounced 300ms):
```typescript
const handleCodeChange = useDebouncedCallback(async (draftCode: string) => {
  const result = parseMermaidByType(draftCode, { architectureStrictMode });
  if (!result.error && result.nodes.length > 0) {
    recordHistory();
    const layouted = await getElkLayout(result.nodes, result.edges, layoutOptions);
    setNodes(layouted);
    setEdges(assignSmartHandles(layouted, result.edges));
  }
  setDiagnostics(result.diagnostics ?? []);
  setPanelError(result.error ?? null);
}, 300);
```

**Status bar** below editor:
- ✅ "Valid" (green pill) — no parse errors, no diagnostics
- ⚠ "2 warnings" (amber pill) — diagnostics but no error
- ❌ "Parse error: line 4 — unknown node" (red text) — error state

**Diagnostic list** — collapsible panel below the status bar:
```
⚠ Line 3: Unknown service 'AUTH' referenced before declaration [architecture-strict]
⚠ Line 7: Icon 'fa:wifi' not available — will be stripped
```

**UX**: Panel slides in from the right, canvas shrinks its width. A toggle button `</>` in the Toolbar (between Undo/Redo and Layout).

#### 1.2 — Mermaid Exporter Fidelity Fix
**File**: `src/services/exportService.ts`

```typescript
function edgeToMermaidArrow(edge: Edge): string {
  const isBidirectional = Boolean(edge.markerStart);
  const isThick = Number(edge.style?.strokeWidth) >= 4;
  const isDashed = typeof edge.style?.strokeDasharray === 'string'
    && edge.style.strokeDasharray.length > 0;
  const isDotted = edge.data?.dashPattern === 'dotted';
  const label = edge.label as string | undefined;

  if (isBidirectional) return label ? `<-->|"${label}"|` : '<-->';
  if (isThick) return label ? `== "${label}" ==>` : '==>';
  if (isDotted) return label ? `~~~ "${label}" ~~~` : '~~~'; // invisible (Mermaid)
  if (isDashed) return label ? `-. "${label}" .->` : '-.->';
  return label ? `-->|"${label}"|` : '-->';
}
```

Add `linkStyle` footer for colored edges:
```typescript
// Collect edges with non-default stroke color
const coloredEdges = edges.filter(e => e.style?.stroke && e.style.stroke !== '#64748b');
coloredEdges.forEach((edge, i) => {
  lines.push(`linkStyle ${edgeIndex(edge)} stroke:${edge.style.stroke},stroke-width:${edge.style.strokeWidth || 1.5}px`);
});
```

**Diagram-type detection** for export routing:
```typescript
export function toMermaid(nodes: FlowNode[], edges: FlowEdge[]): string {
  const diagramType = detectDiagramTypeFromNodes(nodes);
  switch (diagramType) {
    case 'architecture': return toArchitectureMermaid(nodes, edges);
    case 'classDiagram': return toClassDiagramMermaid(nodes, edges);
    case 'erDiagram': return toERDiagramMermaid(nodes, edges);
    case 'mindmap': return toMindmapMermaid(nodes, edges);
    case 'journey': return toJourneyMermaid(nodes, edges);
    case 'stateDiagram': return toStateDiagramMermaid(nodes, edges);
    default: return toFlowchartMermaid(nodes, edges);
  }
}
```

---

### Phase 2 — Parser Fidelity (2-3 days)

#### 2.1 — stateDiagram Dedicated Plugin
**Files**: `src/diagram-types/stateDiagram/plugin.ts` [NEW], `src/diagram-types/stateDiagram/plugin.test.ts` [NEW]

Full parsing support for:
- `[*] --> StateName` — start pseudo-state → `type: 'start'`
- `StateName --> [*]` — end pseudo-state → `type: 'end'`  
- `A --> B : event [guard] / action` — transition with label
- `state "Long label" as Short` — aliased state
- `state ParallelState { ... }` — composite/parallel regions (nested SectionNode)
- `direction LR/TB` inside stateDiagram
- `note right of State : text` → AnnotationNode linked to state
- `state StateName <<choice>>` — choice pseudo-state (diamond shape)
- `state StateName <<fork>>` / `<<join>>` — fork/join bars

Node types produced:
- Regular states: `type: 'custom'`, `shape: 'rounded'`
- `[*]` start: `type: 'start'`, `shape: 'circle'`
- `[*]` end: `type: 'end'`, `shape: 'circle'`
- `<<choice>>`: `type: 'decision'`, `shape: 'diamond'`
- Notes: `type: 'annotation'`

#### 2.2 — Architecture Group Nesting → parentNode
**File**: `src/diagram-types/architecture/plugin.ts`

After node construction, set `parentNode` and `extent`:
```typescript
// When kind === 'group': type = 'section', no parentNode
// When kind has parentId (via `in GroupId`): set parentNode + extent: 'parent'
const flowNode: FlowNode = {
  id: node.id,
  type: node.kind === 'group' ? 'section' : 'architecture',
  parentNode: node.parentId ?? undefined,
  extent: node.parentId ? 'parent' : undefined,
  position: { x: 0, y: 0 }, // ELK will set final positions
  data: { ... },
};
```

ELK must handle parent/child layout: the architecture plugin should pass `parentId` into ELK's `elk.json` parent attribute.

#### 2.3 — Surface Parser Diagnostics
**File**: `src/components/FlowCanvas.tsx`

```typescript
// After parseMermaidByType():
if (result.diagnostics && result.diagnostics.length > 0) {
  addToast(
    `Diagram imported with ${result.diagnostics.length} warning(s) — open Code view for details`,
    'warning',
    8000
  );
}
// Store diagnostics in store for CodeEditorPanel to display
setLastDiagnostics(result.diagnostics ?? []);
```

Add `lastDiagnostics: ParseDiagnostic[]` to the Zustand store's view settings slice.

#### 2.4 — Mermaid Edge Type Full Parsing
**File**: `src/lib/mermaidParser.ts`

Ensure these are all correctly parsed into canvas edge data:

| Mermaid | Canvas Effect |
|---|---|
| `A --> B` | `animated: false`, stroke 1.5px, filled arrow |
| `A ==> B` | `strokeWidth: 4`, filled arrow |
| `A -.-> B` | `strokeDasharray: '6 3'`, animated: false |
| `A --- B` | no arrowhead (`markerEnd: undefined`) |
| `A <--> B` | `markerStart: ArrowClosed, markerEnd: ArrowClosed` |
| `A --o B` | circle marker at target |
| `A --x B` | cross marker at target |
| `A ~~~B` | `opacity: 0` (invisible link for layout only) |
| `A --> B & C` | multiple edges from A |
| `A & B --> C` | multiple edges to C |

Currently `--o` and `--x` are parsed to `ArrowClosed` (wrong). Need to add custom SVG marker defs for circle-end and cross-end.

---

### Phase 3 — Diagram-Type Node Visual Quality (2-3 days)

#### 3.1 — ClassNode: Full UML Formatting
**File**: `src/components/custom-nodes/ClassNode.tsx`

Add visibility modifier rendering (+, -, #, ~):
```tsx
// Parse "  + name: string" → { visibility: '+', name: 'name', type: 'string' }
function parseAttribute(raw: string): { visibility: string; body: string } {
  const match = raw.match(/^([+\-#~])\s*(.+)$/);
  return match
    ? { visibility: match[1], body: match[2] }
    : { visibility: '', body: raw };
}

// Render:
<li className="flex items-baseline gap-1.5 text-xs font-mono">
  <span className="text-slate-400 w-3 shrink-0 text-center select-none">{visibility}</span>
  <span className="text-slate-700">{body}</span>
</li>
```

Color the visibility symbols:
- `+` (public): `text-emerald-500`
- `-` (private): `text-red-500`
- `#` (protected): `text-amber-500`
- `~` (package): `text-blue-500`

Add stereotype badge above class name with `italic` font and angular brackets (`<<interface>>`).

Also: make the separator lines render as actual `<hr>` elements rather than border-b on divs.

#### 3.2 — EntityNode: PK/FK/Type Column Layout
**File**: `src/components/custom-nodes/EntityNode.tsx`

Parse ER field strings like `int id PK` or `string name`:
```typescript
function parseERField(raw: string): { type: string; name: string; key: 'PK' | 'FK' | 'UK' | '' } {
  const parts = raw.trim().split(/\s+/);
  const key = parts.find(p => ['PK', 'FK', 'UK'].includes(p)) as 'PK' | 'FK' | 'UK' | '';
  const name = parts.find(p => !['PK', 'FK', 'UK'].includes(p) && !p.match(/^[a-z]+$/i)) || '';
  const type = parts[0] || '';
  return { type, name: name || parts[1] || '', key: key || '' };
}
```

Render as 3-column table:
```
┌──────┬──────────────┬───────────────┐
│  PK  │ int          │ id            │
│  FK  │ string       │ userId        │
│      │ varchar(255) │ email         │
└──────┴──────────────┴───────────────┘
```

Key column: badge style (`PK` = gold, `FK` = blue, `UK` = green, empty = none).

#### 3.3 — MindmapNode: Depth-Based Visual Hierarchy
**File**: `src/components/custom-nodes/MindmapNode.tsx`

```typescript
const DEPTH_STYLES = [
  { bg: 'bg-slate-900 text-white border-slate-900',    size: 'text-[15px] font-bold px-5 py-3' },   // depth 0 (root)
  { bg: 'bg-indigo-600 text-white border-indigo-500',  size: 'text-[13px] font-semibold px-4 py-2' }, // depth 1
  { bg: 'bg-indigo-50 text-indigo-900 border-indigo-200', size: 'text-[12px] font-medium px-3 py-2' }, // depth 2
  { bg: 'bg-slate-50 text-slate-700 border-slate-200', size: 'text-[11px] font-normal px-3 py-1.5' }, // depth 3+
];
const style = DEPTH_STYLES[Math.min(depth, 3)];
```

Also: curved edges for mindmap connections. The mindmap plugin should set `type: 'default'` (bezier) on all edges, not `smoothstep`.

#### 3.4 — Mindmap Icons (::icon directive)
**File**: `src/diagram-types/mindmap/plugin.ts`

Currently: `rawContent.replace(/\s*::.+$/, '')` strips icons silently.

Fix:
```typescript
const iconMatch = rawContent.match(/::icon\(([^)]+)\)/);
const cleanLabel = rawContent.replace(/\s*::icon\([^)]+\)\s*/g, '').trim();
const iconName = iconMatch ? mapMermaidIconToLucide(iconMatch[1]) : undefined;
```

Add `src/lib/iconMapping.ts` [NEW]:
```typescript
// Maps Mermaid icon specifiers to Lucide icon names
export function mapMermaidIconToLucide(specifier: string): string | undefined {
  const clean = specifier.replace(/^fa[sb]?:/i, '').replace(/-/g, '');
  const iconMap: Record<string, string> = {
    wifi: 'Wifi', database: 'Database', server: 'Server',
    cloud: 'Cloud', lock: 'Lock', user: 'User',
    home: 'Home', settings: 'Settings', star: 'Star',
    // ... expand as needed
  };
  return iconMap[clean.toLowerCase()];
}
```

Store in `data.icon` → MindmapNode renders `<NamedIcon name={data.icon} />` inside the node.

---

### Phase 4 — Per-Diagram-Type Mermaid Exporters (1-2 days)

Create `src/services/mermaid/exporters/` directory with dedicated serializers:

#### 4.1 — `flowchartExporter.ts`
- Full edge type fidelity (see §1.2)
- Includes `linkStyle` for colored edges
- Preserves `direction` (TD/LR/RL/BT) from tab metadata
- Handles subgraphs (section nodes → `subgraph` blocks)

#### 4.2 — `classDiagramExporter.ts`
```
classDiagram
  class Vehicle {
    <<abstract>>
    + String make
    + int year
    + start() bool
  }
  Vehicle <|-- Car
  Vehicle <|-- Truck
```
- Emits `<<stereotype>>`
- Emits attributes with visibility prefix
- Emits methods with return type suffix
- Maps edge data to: `<|--`, `-->`, `..>`, `--o`, `--*`, `<-->`, `..`

#### 4.3 — `erDiagramExporter.ts`
```
erDiagram
  CUSTOMER {
    int id PK
    string name
    string email FK
  }
  CUSTOMER ||--o{ ORDER : "places"
```
- Emits field PK/FK annotations
- Maps edge relation markers: `||..||`, `||--o{`, `}o--||`, etc.

#### 4.4 — `mindmapExporter.ts`
Reconstruct indented tree from `parentNode` relationships:
```
mindmap
  root((OpenFlowKit))
    Features((Features))
      Mermaid Support
      AI Generation
    Roadmap
      v2.0
```
- Use `((` for circle, `[` for box, no brackets for rounded (default)
- Include `::icon(...)` if `data.icon` is set

#### 4.5 — `journeyExporter.ts`
```
journey
  title User Onboarding
  section Sign Up
    Create Account: 5: User
    Verify Email: 3: User, System
  section Activation
    Complete Profile: 4: User
```
- Group nodes by `data.journeySection`
- Include `data.journeyScore` and actors from `data.subLabel`

#### 4.6 — `stateDiagramExporter.ts` (pairs with §2.1 plugin)
```
stateDiagram-v2
  [*] --> Still
  Still --> [*]
  Still --> Moving : Start
  Moving --> Still : Stop
  Moving --> Crash : Accident
  Crash --> [*]
```

---

### Phase 5 — ER Relationship Markers (Edge Arrowheads) (1-2 days)

**The problem**: ER diagrams require specific crow's foot notation on edge ends. Currently all edges use `ArrowClosed` (triangle) which is wrong for ER.

**Solution**: Add custom SVG marker definitions and a `markerType` property on edges.

**File**: `src/components/custom-edge/CustomEdgeWrapper.tsx` [MODIFY]

Add SVG `<defs>` for:
- `circle-open` — small circle (zero-or-one)
- `circle-closed` — filled circle (one-or-more)  
- `diamond-open` — aggregation
- `diamond-closed` — composition
- `cross` — cross/prohibited
- `crow-foot` — many (three lines at end)
- `crow-foot-circle` — zero-or-many (crow foot + circle)
- `crow-foot-one` — one-and-only-one

```svg
<defs>
  <marker id="crow-foot" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
    <polyline points="10 0, 0 3.5, 10 7" stroke="currentColor" fill="none" />
    <line x1="10" y1="0" x2="10" y2="7" stroke="currentColor" />
  </marker>
  <marker id="circle-open" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
    <circle cx="3" cy="3" r="2.5" stroke="currentColor" fill="white" />
  </marker>
</defs>
```

In `erDiagram/plugin.ts` — set `markerStart`/`markerEnd` values from the edge syntax:
- `||--|{` → `markerStart: 'line-line'`, `markerEnd: 'crow-foot-line'`
- `}o--o{` → `markerStart: 'crow-foot-circle'`, `markerEnd: 'crow-foot-circle'`

---

### Phase 6 — Orthogonal Edge Routing for Class/ER Diagrams (1-2 days)

**Problem**: Bezier curves look bad in dense class diagrams. Need right-angle elbow routing.

**Solution**: Add `type: 'orthogonal'` as a new edge variant in `pathUtils.ts`.

```typescript
// pathUtils.ts — new variant
if (variant === 'orthogonal') {
  // True right-angle routing with 90° bends only
  // Algorithm: Manhattan routing with simple L or Z path
  const path = buildOrthogonalPath(
    params.sourceX, params.sourceY, params.sourcePosition,
    params.targetX, params.targetY, params.targetPosition,
    offset
  );
  return { edgePath: path, labelX: (params.sourceX + params.targetX) / 2, labelY: params.sourceY };
}
```

```typescript
function buildOrthogonalPath(sx, sy, sp, tx, ty, tp, offset): string {
  // For horizontal dominance: Z-routing
  const midX = (sx + tx) / 2 + offset;
  return `M ${sx} ${sy} H ${midX} V ${ty} H ${tx}`;
  // For vertical dominance:
  const midY = (sy + ty) / 2 + offset;
  return `M ${sx} ${sy} V ${midY} H ${tx} V ${ty}`;
}
```

Register in `flowCanvasEdgeTypes`:
```typescript
export const flowCanvasEdgeTypes: EdgeTypes = {
  default: CustomBezierEdge,
  smoothstep: CustomSmoothStepEdge,
  step: CustomStepEdge,
  orthogonal: CustomOrthogonalEdge, // NEW
};
```

When parsing `classDiagram` and `erDiagram`, the plugin should set `type: 'orthogonal'` on all edges by default.

---

### Phase 7 — Round-Trip Test Suite (1-2 days)

#### 7.1 — Flowchart Round-Trip
**File**: `src/services/mermaid/flowchartRoundTrip.test.ts` [NEW]

```typescript
const COMPLEX_FLOWCHART = `
flowchart LR
  A[Start] ==> B{Choice}
  B -->|Yes| C((End))
  B -.- D[/Error/]
  C --> E:::special
  style E fill:#f0f0f0,stroke:#333
  linkStyle 0 stroke:#ef4444,stroke-width:3px
`;

it('preserves thick edges, dashed edges, labels on round-trip', () => {
  const parsed = parseMermaidByType(COMPLEX_FLOWCHART);
  expect(parsed.error).toBeUndefined();
  const exported = toMermaid(parsed.nodes, parsed.edges);
  const reparsed = parseMermaidByType(exported);
  expect(reparsed.nodes.length).toBe(parsed.nodes.length);
  expect(reparsed.edges.length).toBe(parsed.edges.length);
  const thickEdge = reparsed.edges.find(e => e.source.endsWith('A'));
  expect(thickEdge?.style?.strokeWidth).toBeGreaterThanOrEqual(4);
});
```

#### 7.2 — classDiagram Round-Trip
```typescript
const CLASS_DIAGRAM = `
classDiagram
  class Animal {
    <<abstract>>
    + String name
    + int age
    + speak() void
    - validate() bool
  }
  class Dog {
    + String breed
    + bark() void
  }
  Animal <|-- Dog
  Animal o-- Owner : "has"
`;
it('classDiagram round-trips with visibility and relationships', () => { ... });
```

#### 7.3 — ER Diagram Round-Trip
#### 7.4 — Mindmap Round-Trip
#### 7.5 — Architecture Round-Trip (extend existing)
#### 7.6 — stateDiagram Round-Trip (new with §2.1 plugin)

---

## 4. Prioritized Implementation Order

| Priority | Phase | Work Summary | Days | Impact |
|---|---|---|---|---|
| **P0** | 0.1, 0.2, 0.3 | Node fills, remove animated edges, handles visible | 1 | Immediate visual quality |
| **P0** | 0.4, 0.5, 0.6, 0.7 | Edge labels, canvas, typography, selection | 1 | Immediate visual quality |
| **P0** | 1.1 | Live code editor panel (bi-directional) | 2 | Core gap — no bi-dir sync |
| **P1** | 1.2 | Mermaid exporter edge fidelity | 1 | Round-trip correctness |
| **P1** | 2.1 | stateDiagram dedicated plugin | 1.5 | Parser completeness |
| **P1** | 2.2 | Architecture group nesting → parentNode | 0.5 | Architecture visual correctness |
| **P1** | 2.3, 2.4 | Surface diagnostics, edge type parsing | 1 | Error surface + fidelity |
| **P2** | 3.1 | ClassNode UML formatting (visibility, separator) | 1 | UML fidelity |
| **P2** | 3.2 | EntityNode PK/FK table format | 1 | ER fidelity |
| **P2** | 3.3, 3.4 | MindmapNode depth colors, icon support | 1 | Mindmap quality |
| **P2** | 4.x | Per-type Mermaid exporters | 2 | Full round-trip |
| **P3** | 5.x | ER crow's foot markers (SVG defs) | 1.5 | ER edge notation |
| **P3** | 6.x | Orthogonal routing for class/ER | 1.5 | Dense diagram clarity |
| **P3** | 7.x | Round-trip test suite | 2 | Quality safety net |

**Total estimated: ~18-22 days** of focused implementation.

---

## 5. Definition of "Done" for 100% Fidelity

A diagram type has **100% fidelity** when:
1. ✅ Paste any valid Mermaid code → canvas renders it correctly with zero broken nodes/edges
2. ✅ Export from canvas → paste back into Mermaid Live → looks identical to the original
3. ✅ All diagram-specific visual elements are present (e.g. PK/FK for ER, visibility +/-/# for class)
4. ✅ All diagnostics (if any) are surfaced to the user — never silent
5. ✅ No test failures in the round-trip test suite for that diagram type

**Current completion by diagram type:**

| Type | Parse | Canvas Render | Export | Round-trip | Overall |
|---|---|---|---|---|---|
| flowchart | ✅ Complete | ✅ All shapes | ⚠️ Loses edge style | ❌ No test | 60% |
| architecture | ✅ Complete | ✅ Good nodes | ⚠️ Group nesting | ✅ Basic test | 75% |
| classDiagram | ✅ Complete | ⚠️ Raw text dump | ❌ No exporter | ❌ No test | 55% |
| erDiagram | ✅ Complete | ⚠️ Raw text dump, no PK/FK col | ❌ No exporter | ❌ No test | 50% |
| mindmap | ✅ Complete | ⚠️ No depth hierarchy | ❌ No exporter | ❌ No test | 55% |
| journey | ✅ Complete | ✅ Score/section/actor | ❌ No exporter | ❌ No test | 65% |
| stateDiagram | ⚠️ Legacy path | ⚠️ Missing pseudo-states | ❌ No exporter | ❌ No test | 35% |

**Post-plan target**: All types at 95%+.
