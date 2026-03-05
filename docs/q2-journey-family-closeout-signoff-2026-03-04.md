# Q2 Journey Family Closeout Signoff (2026-03-04)

## Scope

- Workstream slices:
  - `Q2-P2-04-A` (journey plugin vertical slice)
  - `Q2-P2-04-B` (parser hardening + diagnostics/fuzz path)
  - `Q2-P2-04-C` (authoring UX hardening + properties parity)
  - `Q2-P2-04-RG` (release-gate verification bundle)
- Objective: production-grade Mermaid `journey` support with deterministic parsing, actionable diagnostics, direct in-canvas editing parity, and regression confidence.

## Consolidated Gate Evidence

| Gate | Result | Evidence |
| --- | --- | --- |
| Journey parser correctness + diagnostics | Pass | `npm run test -- --run src/diagram-types/journey/plugin.test.ts` |
| Journey stress corpus resilience | Pass | `npm run test -- --run src/diagram-types/journey/fuzzCorpus.test.ts` |
| Mermaid dispatcher compatibility | Pass | `npm run test -- --run src/services/mermaid/parseMermaidByType.test.ts src/services/mermaid/detectDiagramType.test.ts` |
| Plugin/property registration integrity | Pass | `npm run test -- --run src/diagram-types/registerBuiltInPlugins.test.ts src/diagram-types/registerBuiltInPropertyPanels.test.ts` |
| Canvas renderer mapping integrity | Pass | `npm run test -- --run src/components/flow-canvas/flowCanvasTypes.test.ts` |
| Export/import compatibility sanity | Pass | `npm run test -- --run src/services/exportService.test.ts src/services/importFidelity.test.ts` |
| Static safety checks | Pass | Targeted `npx eslint ...` and `npx tsc -b --pretty false` passed in release-gate run |

## Delivery Summary

1. Journey plugin supports:
   - `journey` header handling
   - `section` grouping
   - step parsing (`Task`, `Task: Score`, `Task: Score: Actor`)
   - per-section sequencing edges
2. Journey parser now surfaces deterministic diagnostics for malformed section syntax, invalid step syntax, and invalid score values while retaining partial-valid parse behavior.
3. Journey node rendering and properties are family-specific and productionized:
   - dedicated Journey node renderer + panel route
   - direct inline editing for section/title/actor
   - semantic sync (`journeyTask`, `journeyActor`) to avoid label/semantic drift
   - all-side bidirectional handles + resizer parity
4. Journey fuzz corpus locks resilience on noisy/malformed input patterns.

## Residual Risks (Post-Closeout)

1. Journey grammar support remains a controlled subset, not full Mermaid journey coverage.
   - Impact: some advanced/rare syntax variants may be diagnosed instead of accepted.
   - Mitigation: continue corpus-driven expansion with diagnostics-first policy.
2. Export fidelity for Journey semantics in mixed-family documents is still tied to broader exporter behavior.
   - Impact: formatting style may differ from hand-authored Mermaid in edge scenarios.
   - Mitigation: add journey-specific round-trip/golden export fixtures in next fidelity pass.
3. Connector behavior is now parity-focused, but very dense Journey canvases may still need future lane/section layout tuning.
   - Impact: readability degradation in large user-journey maps.
   - Mitigation: handle in later layout-quality pass with section-aware spacing policy.

## Handoff Checklist

- [x] Journey parser hardening merged and validated.
- [x] Journey fuzz corpus suite added and green.
- [x] Dispatcher + registration tests green.
- [x] Journey renderer/panel parity updates validated.
- [x] Export/import sanity checks green.
- [x] Typecheck/lint checks green.
- [x] Tracker updated through release-gate row.
- [x] Family closeout signoff document published.

## Decision

- **GO** for Journey family closeout.
- Next roadmap move should transition to `gitGraph` family work (`Q2-P2-05`) under the same full-or-none + corpus-first gate model.

## Signoff

| Field | Value |
| --- | --- |
| Reviewer | Codex + project owner approval flow |
| Date | 2026-03-04 |
| Decision | GO |
