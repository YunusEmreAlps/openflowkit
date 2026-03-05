# Q2 Feature Matrix Baseline (2026-03-04)

Wave 0 artifact for `Have / Partial / Missing` capability baseline.

Legend:
- `Have`: production-usable now
- `Partial`: present but limited for complex workflows
- `Missing`: no first-class workflow

| Capability | Status | Priority | Notes |
| --- | --- | --- | --- |
| Deterministic export for Git diffs | Have | Keep strong | Canonical serialization + deterministic export mode are shipped. |
| DSL round-trip diagnostics | Have | Keep strong | Parser/export diagnostics are shipped with actionable surfaces. |
| Large-graph local performance guardrails | Partial/Have | P0 | Safety mode + LOD shipped; still requires Q2 polish and benchmarks at target workflows. |
| Multi-page diagram management | Partial | P0 | Tab model exists; page-level productivity operations are still limited. |
| Layers (hide/lock/select-by-layer) | Missing | P0 | No first-class layer model yet. |
| Bulk edit selected objects | Partial | P0 | `Q2-P0-01` v1 shipped; needs v2 depth and workflow hardening. |
| Select by common properties/query | Missing | P0 | `Q2-P0-02` not shipped yet. |
| Migration reliability (draw.io/Visio) | Partial | P0 | Core import/export foundations exist; corpus-driven reliability sprint pending. |
| Architecture shape/library depth | Partial | P1 | Domain packs and architecture primitives need expansion. |
| Data-linked visuals / conditional formatting | Missing | P2 | Not first-class yet. |

Baseline source:
- `docs/q2-master-strategy-2026-03-04.md`
- `docs/q2-competitive-audit-2026-03-04.md`
