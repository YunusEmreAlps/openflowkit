# Q2 Mermaid Full-Support Implementation Plan (2026-03-04)

Goal: make OpenFlowKit a reliable home for complex Mermaid workflows while preserving product quality.

Non-negotiable product rule from current direction:
- `Full or none` per diagram family.
- If a family is listed as supported, it must be fully editable and round-trip safe for the supported grammar subset.
- No partial/edit-unsafe mode.

---

## 1) Current System Analysis (Repository-Grounded)

### 1.1 Import and export reality today

1. Mermaid import is custom regex parsing in:
   - `src/lib/mermaidParser.ts`
   - `src/lib/mermaidParserHelpers.ts`
2. Current importer only targets:
   - `flowchart/graph`
   - partial `stateDiagram`
3. Mermaid export is basic flowchart generation only:
   - `src/services/exportService.ts` (`toMermaid`)
4. Code-entry import path is:
   - `src/components/command-bar/CodeView.tsx` -> `parseMermaid(...)` -> `onApply(nodes, edges)`

### 1.2 Canvas and node architecture reality

1. Canvas is React Flow with fixed node type registry:
   - `src/components/flow-canvas/flowCanvasTypes.tsx`
2. Node data model is generic shape/style metadata:
   - `src/lib/types.ts` (`NodeData`, `FlowNode`, `FlowEdge`)
3. Properties panel is generic and type-gated by string checks:
   - `src/components/PropertiesPanel.tsx`
   - `src/components/properties/NodeProperties.tsx`
4. Node insertion flows are generic process/decision/section style:
   - `src/hooks/useNodeOperations.ts`
   - `src/hooks/useEdgeOperations.ts`
   - `src/components/ConnectMenu.tsx`

### 1.3 Why this blocks full Mermaid coverage

1. Many Mermaid families are semantic (class attributes/methods, ER cardinality, git operations, journey scores).
2. A shape-only node model cannot represent these semantics safely.
3. Regex parser cannot scale to full syntax/grammar fidelity across families.

---

## 2) Scope and Support Contract

Initial target families (your requested set):
1. `architecture`
2. `flowchart`
3. `classDiagram`
4. `erDiagram`
5. `gitGraph`
6. `mindmap`
7. `journey`

Support contract per family:
1. Parse/import from Mermaid to typed internal model.
2. Full visual editing in canvas with dedicated property panel support.
3. Export back to Mermaid with stable, deterministic output.
4. Round-trip tests: Mermaid -> model -> Mermaid (idempotent within supported subset).
5. AI generation path supports the same typed schema.

---

## 3) Target Architecture

## 3.1 Diagram plugin system

Add `diagramType` plugin abstraction.

Proposed structure:
- `src/diagram-types/core/`
  - `registry.ts`
  - `types.ts`
  - `contracts.ts`
- `src/diagram-types/<family>/`
  - `schema.ts`
  - `defaults.ts`
  - `importMermaid.ts`
  - `exportMermaid.ts`
  - `validators.ts`
  - `propertyPanel.tsx`
  - `palette.ts`
  - `ai.ts`

Plugin contract:
1. `familyId`
2. schema validators (node + edge + diagram metadata)
3. importer/exporter
4. property panel renderer map
5. canvas node/edge renderer map
6. command-bar palette provider
7. AI output schema prompt helpers

## 3.2 State model evolution

Add diagram-level context:
- `diagramType` on active tab/document metadata.
- typed payload on nodes/edges:
  - keep existing `NodeData` for style baseline
  - add `semantic` object with family-specific typed payload

Serialization updates:
1. Extend document schema in `src/services/diagramDocument.ts` with version bump.
2. Add migration adapters for legacy docs without `diagramType`.
3. Keep deterministic ordering path via `src/services/canonicalSerialization.ts`.

## 3.3 Import pipeline redesign

Replace single parser entry with dispatcher:
1. `detectMermaidFamily(code)` (header-level detection).
2. route to family plugin importer.
3. run schema validation.
4. fail-fast with explicit unsupported syntax diagnostics.

Code path changes:
- `src/components/command-bar/CodeView.tsx`
- new service `src/services/mermaid/parseMermaidByType.ts`

## 3.4 Property panel redesign

Current hardcoded panel checks in `NodeProperties.tsx` should become plugin-driven:
1. common section: label/style/position/layer (shared)
2. family section: semantic fields from plugin
3. edge semantic section by family

Add:
- `src/components/properties/DiagramPropertiesRouter.tsx`
- `src/components/properties/families/<family>/*`

---

## 4) Family-by-Family Design

## 4.1 Flowchart (first migration baseline)

Node semantic fields:
1. `flow.role`: start/process/decision/terminal/custom
2. `flow.shape`
3. optional `flow.subgraphId`

Edge semantic fields:
1. `flow.arrowType`
2. `flow.label`
3. style directives linkage (classDef/linkStyle mapping)

Acceptance:
1. Maintain current capabilities.
2. Expand syntax support for modern flowchart grammar.
3. Keep existing tests and add corpus tests.

## 4.2 Class Diagram

Node semantic fields:
1. `class.name`
2. `class.stereotype?`
3. `class.attributes[]` (visibility, name, type, static)
4. `class.methods[]` (visibility, name, params, returnType, static, abstract)

Edge semantic fields:
1. relation type (inheritance/implementation/association/dependency/aggregation/composition)
2. multiplicity labels

UI components:
1. `ClassNode` renderer with compartment layout.
2. class property editor table for attributes/methods.

## 4.3 ER Diagram

Node semantic fields:
1. `entity.name`
2. `entity.columns[]` (name, type, pk, fk, nullable, unique, default)

Edge semantic fields:
1. cardinality left/right
2. identifying vs non-identifying

UI components:
1. `EntityNode` renderer (table-like).
2. relationship edge label editor for cardinality.

## 4.4 Mindmap

Node semantic fields:
1. `mind.depth`
2. `mind.icon?`
3. `mind.order`
4. `mind.collapsed?`

Rules:
1. strictly hierarchical (no arbitrary cyclic edges).
2. dedicated auto-layout strategy.

## 4.5 Journey

Node semantic fields:
1. `journey.section`
2. `journey.actor`
3. `journey.task`
4. `journey.score` (0-5)

Rules:
1. stage/section ordering.
2. score visualization chips.

## 4.6 GitGraph

Node semantic fields:
1. `git.commitId`
2. `git.message`
3. `git.branch`
4. `git.tags[]`

Edge semantic fields:
1. commit parent relationships
2. merge semantics

Rules:
1. no arbitrary manual edges that break DAG semantics.
2. operations panel: branch/checkout/merge/cherry-pick/tag.

## 4.7 Architecture

Node semantic fields:
1. `arch.provider` (aws/azure/gcp/k8s/custom)
2. `arch.resourceType`
3. `arch.environment`
4. `arch.boundaryId`
5. `arch.zone?`
6. `arch.trustDomain?`

Edge semantic fields:
1. `protocol`
2. `port`
3. `direction`
4. `sla/latency` optional

UI:
1. component library from domain packs (`src/services/domainLibrary.ts` baseline).
2. overlays should remain section-compatible per your earlier decision.

---

## 5) UX and Workflow Plan

## 5.1 Diagram mode ownership

1. User creates/selects diagram family at tab level.
2. Connect menu and add-node palette adapt by family.
3. Properties panel adapts by family semantic schema.

## 5.2 Error and safety UX

1. On import parse failures, show precise family + line + unsupported syntax.
2. Block apply on semantic validation errors.
3. Never silently drop unsupported constructs.

## 5.3 AI workflow integration

1. AI prompt includes selected `diagramType`.
2. AI returns typed JSON payload that is schema-validated.
3. Export to Mermaid generated from typed model, not ad-hoc text.

Integration points:
- `src/services/aiService.ts`
- `src/services/geminiService.ts`
- command-bar AI views/components.

---

## 6) Implementation Phases (Solo-Dev Safe)

## Phase 0: Foundation (1 week)

Change IDs:
1. `Q2-P1-04` Plugin core + registry + diagramType metadata
2. `Q2-P1-05` Mermaid family detection + parser dispatcher skeleton
3. `Q2-P1-06` Property panel routing foundation

Deliverables:
1. plugin contract scaffold
2. no feature regressions on existing flowchart/state path
3. doc schema version bump with migration tests

## Phase 1: Flowchart hardening (1 week)

1. migrate current flowchart parser/exporter into plugin
2. preserve existing behaviors
3. add expanded flowchart corpus tests

Done gate:
1. all current mermaid parser tests pass
2. round-trip deterministic tests pass

## Phase 2: Class + ER (2 weeks)

1. introduce `ClassNode`, `EntityNode`, new edge semantic labels
2. add family-specific property editors
3. add importer/exporter adapters

Done gate:
1. 30+ fixture corpus for each family
2. create/edit/import/export parity for supported subset

## Phase 3: Mindmap + Journey (1.5 weeks)

1. hierarchy/stage semantics + validators
2. family-specific layout profiles
3. AI schema support

## Phase 4: GitGraph (1.5 weeks)

1. git operation model and renderer
2. operation-safe editing constraints
3. commit DAG validation

## Phase 5: Architecture (2 weeks)

1. semantic node/edge metadata model
2. integrate domain libraries as typed resources
3. environment/trust/zone metadata in properties

---

## 7) Testing Strategy

## 7.1 Test layers

1. Unit tests:
   - parser helpers
   - schema validators
   - exporter determinism
2. Integration tests:
   - CodeView import apply path
   - properties panel edits mutate semantic payload correctly
3. Golden corpus:
   - `tests/mermaid-corpus/<family>/valid/*.mmd`
   - `tests/mermaid-corpus/<family>/invalid/*.mmd`
4. Regression:
   - ensure existing P0/P1 functionality unaffected

## 7.2 Required commands per step

1. `npx tsc -b --pretty false`
2. `npm run test -- --run <targeted test files>`
3. `npx eslint <touched files>`
4. for phase merge boundaries: `npm run test -- --run`

---

## 8) Risk Register and Mitigation

1. Risk: schema explosion and brittle code paths.
   - Mitigation: strict plugin contracts + typed validators.
2. Risk: regression in existing flowchart UX.
   - Mitigation: migrate flowchart first with compatibility snapshot tests.
3. Risk: semantic mismatch during Mermaid round-trip.
   - Mitigation: canonical exporter and fixture idempotency checks.
4. Risk: AI generates invalid structures.
   - Mitigation: hard schema validation before apply + actionable errors.
5. Risk: scope creep.
   - Mitigation: full-or-none per family, one family at a time.

---

## 9) Rollback Strategy

Per phase:
1. feature-flag plugin registry path (`diagramPluginEngineEnabled`).
2. keep legacy flowchart parser/exporter path until Phase 2 is stable.
3. rollback by toggling to legacy path and reverting family plugin package.

---

## 10) Tracker Mapping Proposal

Proposed Q2 entries:
1. `Q2-P1-04` Diagram plugin framework + schema versioning
2. `Q2-P1-05` Mermaid family detection + dispatcher
3. `Q2-P1-06` Property panel plugin router
4. `Q2-P1-07` Flowchart plugin migration + corpus hardening
5. `Q2-P1-08` Class diagram full support
6. `Q2-P1-09` ER diagram full support
7. `Q2-P2-03` Mindmap full support
8. `Q2-P2-04` Journey full support
9. `Q2-P2-05` GitGraph full support
10. `Q2-P2-06` Architecture full support
11. `Q2-P2-07` AI typed-schema generation for multi-family diagrams

---

## 11) Immediate Next Step

Start `Q2-P1-04` with no feature-facing changes:
1. introduce plugin contracts and registry.
2. introduce `diagramType` metadata in document model with migration fallback.
3. keep current Mermaid parser active under compatibility adapter.

This gives a safe base to ship each family without destabilizing current users.
