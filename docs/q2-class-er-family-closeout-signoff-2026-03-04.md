# Q2 Class + ER Family Closeout Signoff (2026-03-04)

## Scope

- Workstream slices:
  - Class: `Q2-P1-08`, `Q2-HOTFIX-26`, `Q2-HARDEN-01`, `Q2-P1-08-H2`
  - ER: `Q2-P1-09`, `Q2-HOTFIX-26`, `Q2-HARDEN-01`, `Q2-P1-09-H1`
- Objective: production-grade Mermaid `classDiagram` + `erDiagram` support with parser hardening, in-canvas editing parity, diagnostics coverage, and regression stability.

## Consolidated Gate Evidence

| Gate | Result | Evidence |
| --- | --- | --- |
| Class parser correctness + diagnostics | Pass | `npm run test -- src/diagram-types/classDiagram/plugin.test.ts src/diagram-types/classDiagram/fuzzCorpus.test.ts` |
| ER parser correctness + diagnostics | Pass | `npm run test -- src/diagram-types/erDiagram/plugin.test.ts src/diagram-types/erDiagram/fuzzCorpus.test.ts` |
| Mermaid dispatcher compatibility | Pass | `npm run test -- src/services/mermaid/parseMermaidByType.test.ts src/services/mermaid/detectDiagramType.test.ts` |
| Plugin/property registration integrity | Pass | `npm run test -- src/diagram-types/registerBuiltInPlugins.test.ts src/diagram-types/registerBuiltInPropertyPanels.test.ts` |
| Export/import compatibility sanity | Pass | `npm run test -- src/services/exportService.test.ts src/services/importFidelity.test.ts` |
| Static safety checks | Pass | Targeted `npx eslint ...` and `npx tsc -b --pretty false` passed in release-gate run |

## Delivery Summary

1. Class diagram support is hardened with:
   - dotted class IDs
   - inline class block parsing
   - stereotype declaration support
   - strict relation-token parsing
   - actionable malformed-line diagnostics
2. ER diagram support is hardened with:
   - dotted entity IDs
   - strict ER relation-token parsing
   - actionable malformed-line diagnostics
3. Both families now include noisy-input fuzz corpus tests to lock deterministic behavior.
4. Class/ER editing UX stays aligned with direct in-node text editing and family-specific property panel routing.

## Residual Risks (Post-Closeout)

1. Grammar support is still bounded subset, not exhaustive Mermaid spec coverage.
   - Impact: some advanced/rare syntaxes may be rejected with diagnostics.
   - Mitigation: continue corpus-driven expansion with explicit diagnostics-first policy.
2. Export fidelity for class/ER is still tied to generic export surfaces in mixed-family diagrams.
   - Impact: edge-case formatting preferences may differ from hand-authored Mermaid.
   - Mitigation: add family-specific golden export fixtures during next fidelity pass.
3. Dotted identifiers and strict token parsing can expose previously tolerated invalid legacy inputs.
   - Impact: some old inputs now surface diagnostics instead of silently parsing.
   - Mitigation: keep diagnostics actionable and non-crashing with partial-valid parse retention.

## Handoff Checklist

- [x] Class parser hardening + fuzz suite complete.
- [x] ER parser hardening + fuzz suite complete.
- [x] Dispatcher + registration tests green.
- [x] Export/import sanity checks green.
- [x] Typecheck/lint checks green.
- [x] Tracker updated through release-gate closeout row.

## Decision

- **GO** for Class + ER family closeout.
- Next roadmap focus should move to remaining Mermaid families (`mindmap` hardening continuation, then `journey`/`gitGraph`) with the same corpus-first gate pattern.

## Signoff

| Field | Value |
| --- | --- |
| Reviewer | Codex + project owner approval flow |
| Date | 2026-03-04 |
| Decision | GO |
