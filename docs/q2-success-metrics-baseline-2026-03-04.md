# Q2 Success Metrics Baseline (2026-03-04)

Wave 0 artifact defining baseline values and measurement method for Q2 success criteria.

## Baseline Table (T0)

| Metric | Target (Q2) | T0 Baseline (2026-03-04) | Baseline Status | Measurement Method |
| --- | --- | --- | --- | --- |
| draw.io import success rate | `>=95%` | `T0 pending corpus execution` | Defined, measurement pending | Run seeded `DIO-*` corpus and compute pass/pass_with_diagnostics ratio. |
| visio-target import success rate | `>=90%` (or explicit unsupported diagnostics) | `T0 pending corpus execution` | Defined, measurement pending | Run seeded `VSDX-*` corpus and compute supported+diagnosed outcome ratio. |
| Bulk edit performance (100 selected nodes) | `<=300ms median` | `Feature shipped (Q2-P0-01), perf benchmark pending` | Defined, measurement pending | Add repeatable 100-node bulk-apply benchmark scenario and capture median. |
| Query selection task efficiency | `<=3 actions` for top scenarios | `Feature not shipped yet` | Defined, blocked by `Q2-P0-02` | Usability scenario runs for top 10 query tasks. |
| Layer operations reliability | `0` known corruption regressions | `Feature not shipped yet` | Defined, blocked by `Q2-P0-03` | Regression suite on save/load/undo/redo layer flows. |
| Large-graph UX stability (300-500 nodes) | No sustained severe jank | `Safety mode + LOD shipped; workflow-specific stress baseline pending` | Defined, measurement pending | Standardized stress runbook on target interaction workflows. |
| Feature tickets with rollback + tests | `100%` | `Q2-P0-01 = yes` | Active | Tracker and PR checklist audit. |
| Critical regressions escaping to main | `0` | `0 in tracked Q2 entries` | Active | Tracker + incident log audit. |

## Baseline Notes

- This is a locked baseline definition artifact for Wave 0.
- Metrics marked `measurement pending` are intentionally explicit: method is locked now, measured values land as each P0 implementation slice ships.
- No metric definitions should change without recording it in `docs/q2_execution_tracker.md`.
