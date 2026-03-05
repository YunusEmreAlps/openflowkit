# OpenFlowKit Q2 Master Strategy (2026-03-04)

## 1) Vision, Mission, and Constraints

### Vision

Become the market leader in local-first developer diagramming by making migration from draw.io, Lucidchart, and Visio feel like an upgrade in speed, reliability, and workflow quality.

### Mission (Q2)

Deliver a robust architecture-grade canvas and diagram-as-code workflow that is:

- `100% local-first`
- `100% free to use`
- deployable on `GitHub Pages` (static hosting)
- maintainable by a `solo developer` without accruing unbounded technical debt

### Non-Negotiable Constraints

1. No mandatory backend for core editing workflows.
2. No paid infra dependency for core product usage.
3. No broad rewrites that destabilize current reliability/performance gains.
4. Every major feature ships with rollback path and targeted tests.
5. Code quality must remain explicit, readable, and maintainable (no clever overengineering).

---

## 2) Strategic Positioning

OpenFlowKit should not try to out-enterprise Lucid/Visio on first move.  
It should dominate this category:

`Local-first, deterministic, developer-native architecture diagramming`

Primary differentiation:

1. Deterministic diagram-as-code (stable exports + high-fidelity round-trip).
2. Architecture-grade authoring controls for complex diagrams.
3. Smooth large-graph editing without feature loss.
4. Git-friendly workflows and migration-first onboarding.

Secondary (later) differentiation:

1. MCP companion for automation (optional, local-run first).
2. ChatGPT Apps distribution (after core product leadership signal).

---

## 3) Current Codebase Baseline (Repository-Derived)

This section is based on current repository surfaces and shipped Q1/Q2 work.

### Current strengths (already shipped)

1. Deterministic export mode and canonical serialization:
   - `src/services/canonicalSerialization.ts`
   - `src/hooks/useFlowExport.ts`
   - `src/services/openFlowDSLExporter.ts`

2. Schema/version compatibility and parser diagnostics:
   - `src/services/diagramDocument.ts`
   - `src/lib/openFlowDSLParser.ts`
   - `src/lib/flowmindDSLParserV2.ts`

3. History reliability and per-tab safety:
   - `src/store/actions/createHistoryActions.ts`
   - `src/store/actions/createTabActions.ts`
   - `src/hooks/useFlowHistory.ts`

4. Large-graph safety and interaction performance controls:
   - `src/components/flow-canvas/largeGraphSafetyMode.ts`
   - `src/components/FlowCanvas.tsx`
   - `src/hooks/node-operations/routingDuringDrag.ts`

5. Productivity baseline:
   - align/distribute services (`src/services/AlignDistribute.ts`)
   - keyboard shortcuts (`src/hooks/useKeyboardShortcuts.ts`)
   - multi-tab workflows (`src/store/types.ts`, `createTabActions.ts`)

### Current gaps (high-confidence)

1. First-class bulk edit workflows across large selections.
2. Query-driven selection (select by shared properties/metadata/rules).
3. Layer model (hide/lock/select by layer) as a core authoring primitive.
4. Multi-page/multi-diagram batch authoring ergonomics.
5. Architecture-focused primitives and curated domain libraries depth.
6. Data-driven rule visualization (conditional formatting-lite).
7. Import fidelity breadth for draw.io/Visio edge cases.

---

## 4) Competitive Gap Matrix (What Users Compare During Switch)

Legend:

- `Have`: production-usable now
- `Partial`: present but limited for complex workflows
- `Missing`: no first-class workflow

| Capability | draw.io / Lucid / Visio expectation | OpenFlowKit status | Priority |
| --- | --- | --- | --- |
| Multi-page diagram management | Strong expectation | `Partial` (tabs exist, page workflow not fully productized) | P0 |
| Layers (hide/lock/select-by-layer) | Strong expectation | `Missing` | P0 |
| Bulk edit selected objects | Strong expectation | `Partial` | P0 |
| Select by common properties | Strong expectation for complex diagrams | `Missing` | P0 |
| Architecture shape/library depth | Strong expectation | `Partial` | P1 |
| Data-linked visuals / conditional formatting | Medium-high expectation in business/enterprise flows | `Missing` | P2 |
| Deterministic export for Git | Weak in mainstream tools | `Have` | Keep strong |
| DSL round-trip diagnostics | Weak in mainstream tools | `Have` | Keep strong |
| Large-graph local performance | Often mixed in browser tools | `Partial/Have` (good foundation, needs polish) | P0 |
| Migration reliability (draw.io/Visio) | Critical switch gate | `Partial` | P0 |

---

## 5) Product Pillars for Q2

### Pillar A: Architecture Authoring Power

Goal:

- Complex infrastructure and systems diagrams should be fast to build and maintain.

Outcomes:

- Bulk edits are safe and fast.
- Property-based selection is first-class.
- Layers and page operations remove manual repetition.

### Pillar B: Migration Superiority

Goal:

- Import from incumbent tools with predictable outcomes and actionable fix paths.

Outcomes:

- Fewer failed imports.
- Faster “first successful diagram” after switching.

### Pillar C: Local-First Reliability at Scale

Goal:

- Keep trust high with smooth editing and durable local workflows.

Outcomes:

- No surprise data loss.
- No severe interaction jank in common large-diagram paths.

### Pillar D: Maintainable Engineering System

Goal:

- Ship fast without creating compounding debt.

Outcomes:

- One-by-one scoped changes, tests, rollback per feature.
- No broad unstable refactors.

---

## 6) Detailed Initiative Portfolio (Feasibility / Risk / Impact)

Scale:

- Feasibility: `High / Medium / Low` (solo-dev practicality)
- Risk: `Low / Medium / High` (breakage/regression risk)
- Impact: `Low / Medium / High` (user value + switch leverage)

### P0 Initiatives (Must Ship in Q2)

### Q2-P0-01: Bulk Edit Panel v1

- Problem: repetitive property changes are too slow on large diagrams.
- Scope:
  - Apply style/shape/icon/label/token changes to selected set.
  - One transaction in history stack.
  - Preview summary before apply.
- Feasibility: `High`
- Risk: `Medium` (history/selection regression risk)
- Impact: `High`
- Rollback: disable entry point and revert action wiring.

### Q2-P0-02: Property Query Selection v1

- Problem: users cannot target objects by shared attributes at scale.
- Scope:
  - Query builder for `type`, `shape`, `color`, `label contains`, metadata key/value.
  - Save/load named query presets.
- Feasibility: `Medium`
- Risk: `Medium`
- Impact: `High`
- Rollback: keep basic search; disable query mode.

### Q2-P0-03: Layer System v1

- Problem: no first-class control over visibility/lock/select segmentation.
- Scope:
  - layer create/rename/reorder
  - hide/show
  - lock/unlock
  - move selection to layer
  - select all in layer
- Feasibility: `Medium`
- Risk: `High` (core model + UI + serialization surface)
- Impact: `High`
- Rollback: feature flag all layer behaviors; fall back to flat model.

### Q2-P0-04: Multi-Page Operations v1

- Problem: tab concept exists but power workflows are limited.
- Scope:
  - duplicate page/tab with references preserved
  - copy/move selection across tabs
  - page-level search scope (current/all pages)
- Feasibility: `Medium`
- Risk: `Medium`
- Impact: `High`
- Rollback: keep existing tab switching only.

### Q2-P0-05: Import Fidelity Sprint (draw.io + Visio edge cases)

- Problem: switch blockers if imports fail or degrade silently.
- Scope:
  - golden corpus for draw.io/Visio imports
  - importer diagnostics and “what changed” report
  - repair suggestions where possible
- Feasibility: `Medium`
- Risk: `Medium`
- Impact: `High`
- Rollback: preserve legacy import path as fallback option.

### Q2-P0-06: Performance + UX Guardrails 2.0

- Problem: complex diagrams still expose occasional interaction roughness.
- Scope:
  - tighten safety mode thresholds with user-tunable presets
  - maintain visual quality while interacting
  - benchmark-driven guardrails for 100/300/500 node scenarios
- Feasibility: `High`
- Risk: `Medium`
- Impact: `High`
- Rollback: fallback to current safety mode policy.

### P1 Initiatives (Ship if P0 green)

### Q2-P1-01: Architecture Primitive Pack

- Scope: boundaries, zones, trust domains, region/environment overlays.
- Feasibility: `Medium`
- Risk: `Low-Medium`
- Impact: `High`

### Q2-P1-02: Domain Library Expansion

- Scope: AWS/Azure/GCP/Kubernetes/network/security curated packs.
- Feasibility: `High`
- Risk: `Low`
- Impact: `High`

### Q2-P1-03: Smart Routing for Infrastructure Maps

- Scope: better defaults for orthogonal dense connectivity, optional bundling heuristics.
- Feasibility: `Medium`
- Risk: `Medium`
- Impact: `Medium-High`

### P2 Initiatives (Only if P0/P1 stable)

### Q2-P2-01: Data Rules v1 (Conditional Formatting Lite)

- Scope: metadata-driven visual rules.
- Feasibility: `Medium`
- Risk: `Medium`
- Impact: `Medium-High`

### Q2-P2-02: CSV/JSON Shape Mapping

- Scope: ingest tabular state and map to node metadata/style.
- Feasibility: `Medium`
- Risk: `Medium`
- Impact: `Medium`

### P3 Initiatives (Optional channels)

### Q2-P3-01: MCP Companion v1 (Local-Run)

- Scope: 4-6 deterministic automation tools.
- Feasibility: `Medium`
- Risk: `Low-Medium`
- Impact: `Medium` (high for developer segment)

### Q2-P3-02: ChatGPT App Exploration

- Scope: evaluate distribution upside after core wins.
- Feasibility: `Medium`
- Risk: `Low` (if isolated)
- Impact: `Medium` (channel, not moat)

---

## 7) Solo-Dev Execution System (Anti-Debt)

### Rule Set

1. One scoped change at a time.
2. Every change gets:
   - problem statement
   - risk note
   - validation command(s)
   - rollback path
3. No mixed mega-PRs.
4. No architecture rewrites unless explicit decision record.

### Required artifact per ticket

| Field | Required |
| --- | --- |
| Change ID | `Q2-Px-yy` |
| Feasibility | High/Medium/Low |
| Risk | Low/Medium/High |
| Impact | Low/Medium/High |
| Acceptance Criteria | measurable |
| Test Plan | targeted + broad |
| Rollback | exact revert path |
| Status | Pending/Approved/In Progress/Completed |

### Quality guardrails (coding)

These are mandatory for touched surfaces:

1. Preserve behavior while refactoring.
2. Prefer explicit, readable logic over compact cleverness.
3. Avoid nested ternaries in complex branches.
4. Keep top-level functions explicit and typed.
5. Avoid coupling unrelated concerns in single components/hooks.
6. Add tests for each new user-visible behavior.

This mirrors the code-simplifier intent:

- maintainable code
- no accidental behavior drift
- no needless abstraction debt

---

## 8) 12-Week Delivery Blueprint

### Wave 0 (Week 1): Productized Backlog + Corpus

- Finalize feature matrix with Have/Partial/Missing.
- Build migration corpus and failure taxonomy.
- Define success metrics baselines.

Exit gate:

- Approved ticket map for all P0 items.

Wave 0 completion artifacts (2026-03-04):

- `docs/q2-feature-matrix-2026-03-04.md`
- `docs/q2-migration-corpus-failure-taxonomy-2026-03-04.md`
- `docs/q2-success-metrics-baseline-2026-03-04.md`

### Wave 1 (Weeks 2-4): Authoring Core

- Q2-P0-01 Bulk Edit
- Q2-P0-02 Query Selection
- Q2-P0-04 Multi-Page Operations (phase 1)

Exit gate:

- 3 target workflows completed in < 50% time vs baseline.

### Wave 2 (Weeks 5-7): Layer + Import Reliability

- Q2-P0-03 Layer System
- Q2-P0-05 Import Fidelity

Exit gate:

- Layer operations stable in regression suite.
- Import success + diagnostics meet defined thresholds.

### Wave 3 (Weeks 8-9): Performance/UX Hardening

- Q2-P0-06 Performance + UX Guardrails 2.0

Exit gate:

- No sustained jank under standard stress scenarios.

### Wave 4 (Weeks 10-12): Architecture Pack + Stabilization

- Q2-P1-01 Architecture primitives
- Q2-P1-02 Domain libraries
- Q2-P1-03 Smart routing tuning

Exit gate:

- “Architecture authoring completeness” checklist passes.

---

## 9) Success Metrics (Q2)

Product metrics:

1. Import success rate:
   - draw.io corpus >= 95%
   - visio-target corpus >= 90% (or clear unsupported diagnostics)
2. Bulk edit performance:
   - update 100 selected nodes in <= 300ms median on reference profile
3. Query selection usefulness:
   - select-by-property tasks complete in <= 3 actions for top 10 scenarios
4. Layer operations reliability:
   - zero known corruption regressions in save/load/undo flows
5. Large-graph UX:
   - 300-500 node interaction with no sustained severe jank in common operations

Engineering metrics:

1. Feature tickets with rollback + tests: 100%
2. Critical regressions escaping to main: 0
3. Lint/type/test gates green before merge: 100%

Adoption signals:

1. “switch-from-X” onboarding completion rate.
2. Reduction in import-related bug reports per release.
3. Increase in architecture diagram template usage.

---

## 10) Risk Register and Mitigations

1. Layer model complexity increases state bugs.
   - Mitigation: feature flag + serialization tests + undo/redo invariants.

2. Import fidelity scope explodes.
   - Mitigation: corpus-first prioritization by frequency and impact.

3. Solo bandwidth overload from too many parallel epics.
   - Mitigation: strict WIP cap (max 1 active P0 + 1 validation task).

4. UX regressions from aggressive performance optimizations.
   - Mitigation: interaction-quality acceptance criteria + user-visible toggles.

5. Architecture library maintenance burden.
   - Mitigation: curated starter packs first; add long-tail libraries by demand.

---

## 11) Explicit “Not Now” List (to prevent divergence)

1. Full enterprise real-time collaboration backend.
2. Complex permissions/SSO admin platform.
3. Heavy workflow automation platform expansion before P0 completion.
4. ChatGPT App productionization before core parity/superiority.

---

## 12) Immediate Next Steps

1. Convert P0 initiatives into executable tickets with acceptance tests.
2. Start with `Q2-P0-01` (Bulk Edit Panel v1) as first scoped implementation.
3. Track every execution in `docs/archive/q1_execution_tracker.md` (or rename tracker to cross-quarter later).

---

## Research Sources (2026-03-04)

- draw.io integrations and storage/local workflows:
  - https://www.drawio.com/integrations
  - https://www.drawio.com/doc/faq/storage-location-select
  - https://www.drawio.com/doc/faq/open-diagram-file
  - https://www.drawio.com/blog/data-protection
- Lucidchart product capabilities:
  - https://help.lucid.co/hc/en-us/sections/14660753054484-Work-with-Lucidchart
  - https://lucid.co/blog/lucid-ai-features
  - https://lucid.co/techblog/unlocking-the-power-of-data-driven-diagrams
  - https://community.lucid.co/product-questions-3/where-is-conditional-formatting-8695
- Microsoft Visio web capabilities and ecosystem:
  - https://support.microsoft.com/en-gb/office/what-s-new-in-visio-for-the-web-b360ca1f-3fde-4c12-b7cb-58b7dd1c05dc
  - https://support.microsoft.com/en-us/office/visio-for-the-web-help-991f80ce-ffed-4ada-9b66-c51a114cdaac
  - https://www.microsoft.com/en-us/microsoft-365/visio/microsoft-visio-plans-and-pricing-compare-visio-options
- Hosting and browser constraints relevant to local-first architecture:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
  - https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
