# OpenFlowKit — Architecture Guide

## Overview

OpenFlowKit is a local-first, open-source diagramming tool built on React 19, React Flow, and Zustand. All diagram data lives in the browser (IndexedDB / localStorage) with no required backend.

```
src/
  components/       UI components (nodes, edges, panels, command bar)
  hooks/            Domain hooks that compose store + services
  services/         Pure data services (serialization, layout, export)
  store/            Zustand global store, slices, hooks, persistence
  lib/              Shared types, React Flow compat shim, DSL parser
  config/           Rollout flags, constants
  i18n/             Translation strings
  pages/            Route-level page components
```

---

## State Management — Zustand Store

The single store (`src/store/`) is organised into named **slices**. Each slice has its own hook file for selective subscription.

| Slice | Hook file | Responsibility |
|-------|-----------|----------------|
| Canvas | `canvasHooks.ts` | `nodes`, `edges`, `onNodesChange`, `onEdgesChange`, `onConnect` |
| Tabs | `tabHooks.ts` | Multi-diagram workspace, active tab, CRUD |
| History | `historyHooks.ts` | Undo/redo V2 (per-tab `history.past / future` arrays) |
| Design | `designSystemHooks.ts` | Design systems, global edge options |
| Brand | `brandHooks.ts` | Brand config, brand kits, active kit |
| View | `viewHooks.ts` | Grid, snap, routing, safety mode, language |
| Selection | `selectionHooks.ts` | `selectedNodeId`, `selectedEdgeId`, pending edits |

**Persistence** (`src/store/persistence.ts`) serialises tabs + view settings to IndexedDB on every store change. Storage keys intentionally use the legacy `flowmind_*` prefix — do not rename them without a migration path, as this would silently erase existing user diagrams.

---

## Hook Hierarchy

```
FlowEditor (component)
  └─ useFlowEditorCallbacks    // connects React Flow events → store
  └─ useFlowEditorActions      // keyboard shortcuts, toolbar actions
  └─ useFlowHistory            // undo/redo, delegates to store V2
  └─ useNodeOperations         // add / duplicate / delete nodes
  └─ useEdgeOperations         // add / update / delete edges
  └─ useClipboardOperations    // copy / paste
  └─ useLayoutOperations       // ELK auto-layout
  └─ useFlowExport             // PNG / JSON / GIF export
  └─ useAIGeneration           // prompt → DSL → graph
  └─ usePlayback               // scene/step playback state
```

---

## History (Undo/Redo)

History is the **V2 model** only (V1 was removed 2026-03-18). Each `FlowTab` object carries:

```ts
history: { past: TabSnapshot[], future: TabSnapshot[] }
```

`recordHistoryV2()` snapshots nodes + edges into `past`, clears `future`, and trims to a memory budget (~4 MB). `undoV2()` / `redoV2()` swap snapshots. The `useFlowHistory` hook is the single public interface — components never call store history actions directly.

---

## Layout Engine

ELK.js is loaded as a **lazy singleton** (`src/services/elkLayout.ts`). It is instantiated on first call to `runELKLayout()` and reused thereafter. A `resetElkInstance()` export is provided for test teardown. The singleton is intentionally not part of the Zustand store.

---

## Node System

All diagram nodes render through `CustomNode` (`src/components/CustomNode.tsx`). Rendering is split into sub-components:

| Component | Purpose |
|-----------|---------|
| `NodeShapeSVG` | Renders complex SVG shapes (diamond, hexagon, cylinder, …) from declarative props |
| `IconAssetNodeBody` | Full layout for icon-first asset nodes (architecture icon packs, custom URLs) |
| `CustomNode` | Standard node body — uses `NodeShapeSVG` for complex shapes, delegates to `IconAssetNodeBody` for asset nodes |

Custom edges go through `CustomEdgeWrapper` which applies design system stroke colour, width, and relation-type dash patterns.

---

## DSL — OpenFlow YAML

OpenFlowKit has its own text DSL (`openflow`) parsed by `src/lib/openFlowDSLParser.ts`. The AI generation pipeline produces OpenFlow YAML which is then hydrated into React Flow nodes/edges.

Code fence markers accepted by the parser: ` ```openflow `, ` ```yaml ` (and legacy ` ```flowmind ` for backwards compatibility with saved AI responses).

---

## Rollout Flags

Feature flags are defined in `src/config/rolloutFlags.ts`. Each flag maps to a `VITE_*` env variable so builds can be configured per-environment without code changes.

```ts
// Example
const ROLLOUT_FLAGS = {
  visualQualityV2: import.meta.env.VITE_ROLLOUT_VISUAL_QUALITY_V2 === 'true',
};
```

Flags should be removed once a feature is fully promoted (no dead code).

---

## Export Pipeline

| Format | Entry point | Notes |
|--------|-------------|-------|
| PNG | `useFlowExport → html-to-image` | Captures React Flow canvas |
| JSON | `useFlowExport → canonicalSerialization` | Deterministic key ordering |
| GIF | `useFlowExport → animatedExport + gifEncoder` | Playback scene frames |

---

## E2E Tests

Playwright specs live in `e2e/`. Run with `npm run e2e`. The app must be running on `localhost:5173` (default Vite port).

- `smoke.spec.ts` — tab creation, snapshot save/restore
- `workflows.spec.ts` — node create/edit, undo/redo, export JSON/PNG, copy-paste, delete, share panel
