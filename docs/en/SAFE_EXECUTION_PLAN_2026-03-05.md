# OpenFlowKit Safe Execution Plan (One-by-One)

Date: 2026-03-05

This plan converts the roadmap into low-risk, reversible steps.

## Execution Rules (Mandatory)

1. One change-set at a time.
2. Every change-set has:
- feature flag
- acceptance checks
- rollback procedure
3. No new phase starts until current phase gate is green.
4. Any regression in parser/export/history/performance blocks release.

## Phase S0: Safety Harness (Start Here)

Goal: create guardrails before feature work.

Deliverables:
1. Feature-flag registry for major roadmap tracks.
2. Baseline snapshot tests for current node/edge rendering.
3. Round-trip harness:
- Mermaid -> Canvas -> Mermaid diff checks.
4. Corpus runner integration with migration taxonomy IDs.
5. Release checklist template (build, tests, rollback test).

Exit gate:
1. Harness runs in CI.
2. At least one baseline family per type validated.

## Phase S1: React Flow v12 Migration

Goal: remove dependency risk before deeper canvas/parser work.

Deliverables:
1. Package migration:
- `reactflow` -> `@xyflow/react`
2. API migration:
- `parentNode` -> `parentId`
- `onEdgeUpdate` -> `onReconnect`
- any node/edge typing and measured size changes
3. CSS/import path updates.
4. Regression fixes for custom nodes/edges, selection, resizing.

Exit gate:
1. Existing e2e critical paths pass.
2. No visual regression on baseline snapshots.
3. Round-trip baseline unchanged.

## Phase S2: Visual Quality (Flag: `visual_v2`)

Goal: high-impact polish with low semantic risk.

Deliverables:
1. Node fills/tokens alignment.
2. Edge default styling and animation default off.
3. Always-visible handles + larger hit area.
4. Edge label pill restyle.
5. Typography, overflow clamp, selection glow.
6. Canvas background tuning.

Exit gate:
1. Snapshot diffs approved.
2. Interaction smoke tests pass (drag/connect/edit/select).

## Phase S3: Mermaid Sync and Diagnostics (Flag: `mermaid_sync_v1`)

Goal: fix fidelity and observability.

Deliverables:
1. Live Mermaid code panel (debounced apply).
2. Parser diagnostics surfaced in UI/store.
3. Exporter preserves arrow/style semantics where supported.
4. Deterministic per-family routing in exporter.

Exit gate:
1. Round-trip drift metric below agreed threshold.
2. No silent parse failure in tested corpus.

## Phase S4: Family Fidelity (Flag: `family_plugin_v1`)

Goal: safely expand semantic correctness.

Deliverables:
1. `stateDiagram` dedicated plugin path.
2. Architecture boundary parenting (`parentId` in v12).
3. Extended edge marker support and parsing parity.
4. Class/ER/mindmap visual-semantic refinements.

Exit gate:
1. Family graduation checklist passes per family:
- parser coverage
- property editing
- export parity
- round-trip corpus pass

## Release Cadence

1. Internal branch verification.
2. Flag-enabled canary.
3. Broad rollout after 48h stability window.

## Rollback Policy

1. Disable feature flag first.
2. Revert only the current change-set branch.
3. Keep prior phases intact.

## Tracking Template (Per Change-Set)

1. Change ID:
2. Files touched:
3. Feature flag:
4. Risks:
5. Acceptance checks:
6. Rollback steps:
7. Status:

