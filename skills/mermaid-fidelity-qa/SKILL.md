---
name: mermaid-fidelity-qa
description: Verifies Mermaid import/export fidelity using corpus-driven checks, round-trip diffing, parser diagnostics assertions, and per-family acceptance gates.
---

# Mermaid Fidelity QA

Use this skill when implementing or reviewing Mermaid parser/exporter changes.

## Workflow

1. Select affected families.
- flowchart, classDiagram, erDiagram, mindmap, journey, stateDiagram, architecture.

2. Run round-trip checks.
- Mermaid -> Canvas -> Mermaid
- Compare semantic equivalence for supported subset.

3. Validate diagnostics behavior.
- Ensure unsupported syntax is surfaced, not silently dropped.
- Verify error/warning severity and line references.

4. Validate style/edge fidelity.
- arrow types
- dashed/thick/no-arrow variants
- labels and link styles where supported

5. Update corpus and taxonomy mapping.
- Add/adjust corpus IDs for any new supported syntax.
- Tag known unsupported behavior explicitly.

## Acceptance Gate

1. No silent parser failures.
2. Round-trip drift stays within declared subset contract.
3. Export output deterministic for identical input state.
4. Regression report attached to change summary.

