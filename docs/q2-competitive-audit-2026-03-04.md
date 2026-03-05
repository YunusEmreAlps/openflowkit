# Q2 Competitive Audit Refresh (2026-03-04)

## Executive Summary

If OpenFlowKit wants switching from draw.io/Lucidchart/Visio to feel like an upgrade, Q2 should focus on one core promise:

- `Local-first + developer-grade determinism + premium performance at scale`

Decision:

1. Core product superiority is `P0` (most investment).
2. MCP is `P2` (small optional power layer after core wins are stable).
3. ChatGPT Apps is `P3` (distribution channel later, not core moat now).

---

## Competitive Snapshot

## 1) diagrams.net (draw.io)

Observed strengths:

- Strong local/offline posture (desktop app positioned as fully offline).
- Flexible storage targets (device, browser/local, GitHub/GitLab, Drive, OneDrive, Dropbox).
- Broad ecosystem integrations (Atlassian, GitHub, Notion, Nextcloud, etc.).
- Clear privacy messaging: app does not require storing diagram data on vendor servers.

Implication for OpenFlowKit:

- We must beat draw.io on: UX quality, auto-layout quality, and Git-native deterministic workflows.
- We cannot rely only on "local-first" messaging; draw.io already has a strong story there.

## 2) Lucidchart

Observed strengths:

- Strong collaboration and enterprise integration positioning.
- Heavy investment in AI workflows and integrations (including ChatGPT-related integrations in marketplace ecosystem).
- Data-linked diagram workflows and conditional formatting are a major differentiator in business use cases.

Observed constraints (from public/community signals):

- Browser-first model (offline support exists but desktop app positioning is weak).
- Import/migration from other formats can be a friction point in some user scenarios.

Implication for OpenFlowKit:

- We should win on offline reliability + deterministic file workflows + migration quality.
- Our "developer + repo" motion should be much stronger than Lucid’s browser-enterprise-first model.

## 3) Microsoft Visio

Observed strengths:

- Deep Microsoft 365 and enterprise positioning.
- Visio web continues shipping new capabilities (e.g., infinite canvas, mind maps, layers).
- Strong integration in Teams/Power BI/M365 ecosystem.

Important ecosystem change:

- The Visio Data Visualizer add-in for Excel has retirement milestones (publicly announced for 2026), while Plan 2 still retains deeper diagram/data features through core Visio experiences.

Implication for OpenFlowKit:

- We should avoid competing head-on on M365 lock-in.
- We should target teams that want faster, modern, local-first, Git-friendly workflows without enterprise platform coupling.

## 4) Miro / FigJam / Whimsical / Excalidraw (adjacent pressure)

Observed strengths:

- Miro/FigJam: strong AI-assisted ideation and broad collaborative whiteboard workflows.
- Whimsical: speed-focused UX for diagrams/flowcharts.
- Excalidraw: simple, developer-loved, open-source and collaboration-friendly.

Implication for OpenFlowKit:

- "Whiteboard + ideas" alone is not enough; we need to own "production diagram engineering."
- Our moat should be correctness, determinism, export reliability, and scalability.

---

## Where OpenFlowKit Must Be Better (Switch = Upgrade)

## A) Deterministic Diagram-as-Code (non-negotiable)

Target:

- Round-trip reliability for Mermaid/OpenFlow DSL with explicit diagnostics.
- Stable deterministic exports for Git diffs.

Why it wins:

- draw.io/Lucid/Visio are strong diagram tools, but developer-grade deterministic text workflows are still under-served in mainstream tools.

## B) Large-Graph Performance UX

Target:

- Smooth interaction at 100-500 nodes under realistic editing workflows.
- Safety modes that preserve UX quality (not visual degradation surprises).

Why it wins:

- Users switching from traditional tools quickly notice jank and trust loss.

## C) Migration and Compatibility Quality

Target:

- Best-in-class import from draw.io/Visio/Mermaid/OpenFlow.
- Clear migration diagnostics and fix suggestions.

Why it wins:

- Switching friction is the #1 blocker to adoption.

## D) Local-First Reliability

Target:

- Zero-surprise save/restore.
- Strong backup/export prompts before storage pressure issues.
- Optional local companion workflows without requiring paid backend.

Why it wins:

- Trust + ownership story for technical teams.

---

## Canvas/Node Feature Parity Deep-Dive (What You Called Out)

You are correct: advanced node/canvas workflows are primary, not secondary.  
For complex architecture diagrams, parity (and then superiority) requires deeper authoring controls than we currently expose.

### Competitor capabilities users expect on day 1

Common patterns across draw.io, Lucidchart, and Visio:

- Multi-page diagram workflows and page-level operations.
- Layer controls (hide/show/lock/select-by-layer).
- Bulk style operations and reusable defaults.
- Search/find workflows that include in-diagram content/metadata.
- Data-linked shapes + conditional formatting (especially Lucid/Visio).
- Large cloud/network stencil ecosystems (AWS/Azure/networking, etc.).

### OpenFlowKit current state (inference from repository + Q1/Q2 work)

Current strengths:

- Strong base node model + multiple node types.
- Multi-tab support and robust undo/redo safety work.
- Deterministic export and improved DSL diagnostics.
- Alignment/distribution/grouping and keyboard productivity flows.
- Large-graph safety mode and LOD/perf hardening.

Key gaps for “complex architecture” switchers:

1. Property-driven bulk editing is limited (no first-class query builder for mass edits).
2. Selection by common properties/tags/rules is missing as a dedicated workflow.
3. Layer model is not first-class in UI (lock/hide/select by layer analog).
4. Multi-file/multi-diagram batch operations are limited.
5. Data-linked rules/conditional formatting workflows are not equivalent to Lucid/Visio.
6. Architecture-library depth and domain presets (AWS/Azure/K8s/network/SRE) need to be expanded and curated.
7. Higher-level architecture authoring primitives (zones, boundaries, trust domains, environment overlays) need richer support.

### Q2 “Architecture Authoring” track (must-have)

#### P0: Power Editing Core (no compromises)

1. **Bulk Edit Panel v1**
   - Scope: apply shared changes to N selected nodes/edges.
   - Fields: shape, style token, icon set, border/stroke, typography, metadata fields.
   - Guardrails: preview summary + undo-safe single transaction.

2. **Property Query Selection v1**
   - Scope: select by `type`, `shape`, `color`, `icon`, `label contains`, `metadata key/value`, `in-viewport`.
   - Output: saveable query presets.

3. **Layer System v1**
   - Scope: layer create/rename/order + hide/show + lock/unlock + move selection to layer + select layer objects.
   - Requirement: predictable export/import behavior for layers.

4. **Multi-Page / Multi-Diagram Operations v1**
   - Scope: duplicate page, move/copy selections across pages, consistent page metadata.
   - Extend Search panel to page/global scope controls.

#### P1: Architecture Diagram Professional Pack

1. **Architecture Primitives**
   - Zones/boundaries, VPC/subnet-like containers, trust boundaries, region/env overlays.

2. **Domain Libraries**
   - Curated AWS/Azure/GCP/network/security/Kubernetes icon+shape packs.
   - Tokenized rendering so brand/theming still works.

3. **Smart Connect Rules**
   - Better orthogonal routing defaults for infrastructure diagrams.
   - Edge bundling/avoidance options for dense network maps.

#### P2: Data-Driven Diagram Features (after P0/P1)

1. Shape metadata schema editor.
2. Rule-based visual states (conditional formatting-lite).
3. CSV/JSON mapping to shapes for status overlays.

---

## Q2 Priority Reset (Must / Should / Later)

## Must (Q2 Core)

1. `Import fidelity sprint`: draw.io + VSDX edge cases, migration report, auto-fix prompts.
2. `Auto-layout quality sprint`: 4 presets with measurable quality benchmarks on golden corpus.
3. `Performance polish sprint`: interaction smoothness guardrails and visual consistency at 100-500 nodes.
4. `Determinism hardening`: no-regression gates for export stability and DSL round-trip.
5. `Switching UX`: onboarding "Import from draw.io/Visio" + compatibility checklist + known-issues guidance.
6. `Architecture authoring core`: bulk edit, property-query selection, layers, multi-page operations.

## Should (Q2.5 if Must is green)

1. `Advanced data bindings v1`: lightweight shape-data mapping and conditional styling primitives.
2. `Review mode`: comment/review flows optimized for async team feedback (local-first compatible).
3. `Template quality pack`: architecture and engineering diagram packs tuned for practical adoption.

## Later (do not block core)

1. `MCP companion v1` (local process, no paid infra): 4-6 tools max.
2. `ChatGPT App distribution`: only after core product superiority and MCP usage signal.

---

## MVP Scope for MCP (When Ready)

Only proceed after Q2 core metrics are green.

Proposed minimal tools:

- `validate_openflow_dsl`
- `convert_mermaid_to_openflow`
- `export_deterministic_json`
- `run_layout_preset`
- `diagram_diff_summary`

Constraint:

- Keep MCP optional and local-run first to preserve local-first vision and zero hosting cost.

---

## Risks If We Don’t Re-Prioritize

1. Feature divergence without core differentiation.
2. Shipping channels (MCP/ChatGPT app) before product moat is strong.
3. "Looks powerful, feels unstable" perception during switch evaluations.
4. Losing developer audience to simpler but more predictable tools.

---

## 30-Day Execution Plan (Pragmatic)

Week 1:

- Import fidelity benchmark suite (`draw.io`, `vsdx`, `mermaid`) + failure taxonomy.
- Canvas parity spec for bulk edit/query/layers/multi-page.

Week 2:

- Auto-layout quality + performance tuning against golden fixtures.
- Build Bulk Edit Panel v1 + transaction-safe undo path.

Week 3:

- Migration UX and diagnostics pass (actionable errors, one-click fixes where possible).
- Build Property Query Selection v1 + saved query presets.

Week 4:

- Release hardening: regression gates, benchmark deltas, switcher onboarding docs/demo.
- Build Layer System v1 and validate import/export compatibility behavior.

Exit gate:

- "Switching from draw.io/Lucid/Visio feels faster, safer, and more Git-friendly" validated on target scenarios.

---

## Sources (researched 2026-03-04)

- draw.io integrations: https://www.drawio.com/integrations
- draw.io storage locations: https://www.drawio.com/doc/faq/storage-location-select
- draw.io open/import support: https://www.drawio.com/doc/faq/open-diagram-file
- draw.io offline/privacy posture: https://www.drawio.com/blog/disable-ai-diagrams
- draw.io data protection: https://www.drawio.com/blog/data-protection
- Lucid AI features: https://lucid.co/blog/lucid-ai-features
- Lucid marketplace AI Custom GPT: https://lucid.co/marketplace/f4db4a1f/ai-custom-gpt
- Lucid integrations context: https://lucid.co/marketplace
- Visio plans/pricing compare: https://www.microsoft.com/en-us/microsoft-365/visio/microsoft-visio-plans-and-pricing-compare-visio-options
- Visio for web updates: https://support.microsoft.com/en-us/office/what-s-new-in-visio-for-the-web-b360ca1f-3fde-4c12-b7cb-58b7dd1c05dc
- Visio web help/FAQ: https://support.microsoft.com/en-us/office/visio-for-the-web-help-991f80ce-ffed-4ada-9b66-c51a114cdaac
- Visio Data Visualizer retirement notice: https://techcommunity.microsoft.com/blog/microsoft_365blog/retirement-of-the-visio-data-visualizer-add-in-for-excel-and-next-steps/4465747
- Miro AI diagrams help: https://help.miro.com/hc/en-us/articles/28782102127890-Miro-AI-with-Diagrams-and-mindmaps
- Miro diagrams help: https://help.miro.com/hc/en-us/articles/25275263961874-Miro-Diagrams
- FigJam AI: https://www.figma.com/figjam/ai/
- FigJam + ChatGPT diagram flow mention: https://www.figma.com/figjam/
- Excalidraw Plus: https://plus.excalidraw.com/
- Whimsical diagrams: https://whimsical.com/diagrams
