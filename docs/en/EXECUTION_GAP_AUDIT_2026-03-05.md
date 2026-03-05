# OpenFlowKit Execution Gap Audit (2026-03-05)

Scope reviewed:
- `docs/en/DIAGRAM_QUALITY_MASTER_PLAN.md`
- `docs/en/PAX_ROMANA.md`
- `docs/q2-master-strategy-2026-03-04.md`
- `docs/q2-mermaid-full-support-implementation-plan-2026-03-04.md`
- `docs/q2-migration-corpus-failure-taxonomy-2026-03-04.md`

## Critical Gaps

1. Missing dependency gate for React Flow migration.
- `DIAGRAM_QUALITY_MASTER_PLAN.md` and `PAX_ROMANA.md` propose `parentNode` wiring while the planned migration target is React Flow v12 (`@xyflow/react`), which uses `parentId`.
- Risk: rework and regressions if feature work lands before migration.

2. Scope conflict with solo-dev constraint.
- Q2 strategy says "no broad rewrites" and "one-by-one scoped changes."
- `PAX_ROMANA.md` includes large platform expansions (monorepo split, workers, collaboration, IDE integrations) that are not decomposed into small reversible increments.
- Risk: parallel large surfaces increase breakage probability.

3. Acceptance criteria are incomplete for many initiatives.
- Visual and fidelity tasks are clear, but pass/fail gates are inconsistent.
- Missing mandatory checks per change: snapshot diff, round-trip diff, performance budget, rollback drill.

4. No unified change-control model across plans.
- Rollback is mentioned in some docs, but not as a single required process.
- Missing standard: feature flag name, validation checklist, rollback command/process.

5. Mermaid "full support" contract not mapped to release slices.
- Q2 Mermaid plan states "full or none per family" but execution slices are not tied to explicit "family graduation criteria."
- Risk: partial behavior leaks into production.

6. Data migration safety details are under-specified.
- IndexedDB migration is planned, but there is no explicit idempotent migration protocol, backup/restore checkpoint, or partial-failure fallback.

## Secondary Gaps

1. Metrics are not linked to each phase deliverable.
- Need per-phase SLOs (parse success rate, round-trip drift rate, import latency, crash-free sessions).

2. Security/abuse controls for share flows need definition.
- Gist-based sharing needs rate limits and payload validation boundaries in worker logic.

3. Corpus coverage expansion not connected to each implementation phase.
- Failure taxonomy exists, but each feature ticket should list impacted corpus IDs and required new IDs.

## Decisions Needed Before Execution

1. Lock React Flow migration as an explicit prerequisite gate for parser/container work.
2. Define a single "safe change template" used by all major tickets.
3. Choose first release slice:
- Option A: `ReactFlow v12 migration + safety harness`
- Option B: `Visual quality only` behind flag while v12 runs on separate branch

## Recommended Resolution

1. Adopt a two-track model:
- Track A: Stability foundations (v12 migration, test harness, feature flags)
- Track B: Feature delivery (visual quality, exporter/parser fidelity)

2. Enforce graduation gates for each track:
- Build green, typecheck green, targeted tests green
- Corpus subset green for touched diagram families
- Rollback flag tested

3. Ship in this order:
1. Safety harness + feature flags
2. React Flow v12 migration
3. Phase 0 visual quality
4. Exporter + diagnostics
5. State/plugin fidelity work

