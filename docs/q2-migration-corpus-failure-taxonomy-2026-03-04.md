# Q2 Migration Corpus + Failure Taxonomy (2026-03-04)

Wave 0 artifact for migration reliability work (`Q2-P0-05`).

## Scope

Corpus tracks import/migration scenarios for:
- `draw.io` (`.drawio`, XML payload variations)
- `Visio` (`.vsdx`-derived scenarios via supported import path and conversion surfaces)
- `Mermaid` (flowchart/state diagram source inputs)
- `OpenFlow DSL` (round-trip and diagnostics quality)

Each corpus item should have:
- `id`
- `source_format`
- `scenario`
- `expected_outcome` (`pass`, `pass_with_diagnostics`, `known_unsupported`)
- `failure_code` (if not pass)
- `owner`
- `status`

## Seed Corpus (Week 0)

| Corpus ID | Source | Scenario | Expected Outcome | Status |
| --- | --- | --- | --- | --- |
| DIO-001 | draw.io | Basic flowchart nodes/edges/labels | pass | Seeded |
| DIO-002 | draw.io | Groups/containers and nested nodes | pass_with_diagnostics | Seeded |
| DIO-003 | draw.io | Mixed edge styles/arrowheads | pass | Seeded |
| DIO-004 | draw.io | Long labels + multiline text | pass | Seeded |
| DIO-005 | draw.io | Theme-heavy styling tokens | pass_with_diagnostics | Seeded |
| DIO-006 | draw.io | Icons/images in nodes | pass_with_diagnostics | Seeded |
| DIO-007 | draw.io | Large graph (100+ nodes) | pass | Seeded |
| DIO-008 | draw.io | Corrupted/partial XML payload | known_unsupported | Seeded |
| VSDX-001 | visio | Basic process diagram | pass_with_diagnostics | Seeded |
| VSDX-002 | visio | Swimlane-like layout semantics | pass_with_diagnostics | Seeded |
| VSDX-003 | visio | Shape metadata with custom properties | pass_with_diagnostics | Seeded |
| VSDX-004 | visio | Connectors with label metadata | pass_with_diagnostics | Seeded |
| VSDX-005 | visio | Large mixed-stencil diagram | pass_with_diagnostics | Seeded |
| VSDX-006 | visio | Unsupported stencil feature path | known_unsupported | Seeded |
| MMD-001 | mermaid | Simple flowchart TB | pass | Seeded |
| MMD-002 | mermaid | State diagram basics | pass | Seeded |
| MMD-003 | mermaid | Link styles/class defs ignored safely | pass_with_diagnostics | Seeded |
| MMD-004 | mermaid | Multiline label content | pass | Seeded |
| OFD-001 | openflow | Canonical round-trip simple graph | pass | Seeded |
| OFD-002 | openflow | Round-trip with edge labels/offset metadata | pass | Seeded |
| OFD-003 | openflow | Invalid syntax diagnostics path | pass_with_diagnostics | Seeded |

## Failure Taxonomy (Week 0 Baseline)

| Code | Category | Definition | Typical Action |
| --- | --- | --- | --- |
| FMT-001 | Format Parse Failure | Source cannot be parsed into a valid intermediate graph. | Block import, show exact parse diagnostics. |
| MAP-001 | Shape Mapping Loss | Source shape has no direct equivalent. | Fallback shape + warning in migration report. |
| MAP-002 | Style Token Degradation | Source style cannot map 1:1. | Preserve closest style + explicit report item. |
| EDGE-001 | Connector Semantics Drift | Arrow/connector semantics altered during conversion. | Keep directionality, emit warning with affected IDs. |
| TEXT-001 | Label/Text Fidelity Loss | Label content/formatting differs materially post-import. | Preserve plaintext minimum + warning. |
| META-001 | Metadata Drop | Custom fields not preserved through mapping. | Preserve known keys, report dropped keys. |
| PERF-001 | Large-Graph Import Timeout | Import path exceeds acceptable latency envelope. | Add guarded mode + benchmark + timeout diagnostics. |
| UNSUP-001 | Known Unsupported Capability | Source feature intentionally unsupported in current version. | Continue with explicit known-unsupported diagnostics. |
| DOC-001 | Invalid Source Document | Corrupt or incomplete file structure. | Block with actionable remediation guidance. |

## Wave 0 Exit Notes

- Corpus framework and seed taxonomy are now defined.
- `Q2-P0-05` uses this artifact as the ground truth for implementation and measurement.
