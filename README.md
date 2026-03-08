# OpenFlowKit

OpenFlowKit is a local-first diagram editor for developers and technical teams. It combines a fast React Flow canvas, structured exports, reusable templates, and production cloud icon libraries so teams can sketch workflows, architecture, system maps, and planning diagrams without leaving the browser.

## What the product does

- Build flowcharts, architecture diagrams, mind maps, journeys, and lightweight wireframes.
- Start from 20 curated templates covering product, operations, cloud architecture, planning, and ideation.
- Insert AWS, Azure, and CNCF SVG assets directly onto the canvas as icon-first nodes.
- Use Lucide-based icon assets for general-purpose technical diagrams.
- Export to SVG, PNG, JPG, Figma paste, Mermaid, PlantUML, OpenFlow DSL, and JSON.
- Keep work local by default with browser autosave and optional collaboration links.

## Product principles

- Local-first by default. Diagram data stays in the browser unless you explicitly export it or join a live collaboration room.
- Fast editing over heavy chrome. Asset nodes stay lightweight and provider icons are lazy-loaded.
- Structured outputs matter. The editor is designed around round-trippable data and standards-friendly exports.
- Progressive enhancement. Experimental collaboration and large icon packs stay behind guarded runtime behavior instead of bloating the initial experience.

## Feature overview

### Diagram building

- Core shapes: rounded rectangles, rectangles, capsules, circles, diamonds, hexagons, cylinders, parallelograms, and more.
- Node types: process, decision, start/end, annotations, text, sections, image nodes, browser/mobile wireframes, architecture/icon nodes.
- Editing tools: inline text editing, alignment/distribution, duplication, grouping, history, snapshots, and keyboard shortcuts.
- Styling: brand-aware tokens, design-system controls, color themes, icons, and typography controls.

### Asset system

- `General`: notes, text, sections, journeys, mind maps, architecture blocks, wireframes, and uploads.
- `Icons`: Lucide-backed icon asset catalog.
- `AWS`: imported SVG icon pack with provider categories and lazy preview loading.
- `Azure`: imported Microsoft architecture SVG pack with the same icon-first insertion model.
- `CNCF`: imported cloud-native artwork SVG pack.
- `GCP`: ingestion is intentionally gated until redistribution is explicitly cleared in this repo.

### Templates

The starter library ships with 20 templates across:

- Generic workflows and operational runbooks
- AWS architecture starters
- Azure architecture starters
- CNCF and Kubernetes-style platform diagrams
- Mind maps and planning boards
- User journey and wireframe starters

Templates are defined in [starterTemplates.ts](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/services/templateLibrary/starterTemplates.ts) and exposed through [templates.ts](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/services/templates.ts).

### Collaboration

- Live collaboration is available through browser-based room links.
- Links now stay lightweight by default and no longer package extra room secrets when the standard local-first room key is sufficient.
- Collaboration should still be treated as a convenience layer, not durable backend storage.

### Privacy and analytics

- Analytics are off by default.
- The welcome modal is off by default.
- The UI explicitly communicates that local autosave stays on-device.
- Exports remain the recommended path for durable handoff and backup.

## Stack

- React 19
- TypeScript 5
- Vite 6
- React Flow / XYFlow
- Zustand
- Tailwind CSS 4
- Framer Motion
- Vitest + Testing Library

## Project layout

```text
src/
  components/
    command-bar/        Command palette views such as Assets and Templates
    custom-nodes/       Specialized node renderers
    flow-canvas/        Canvas orchestration and overlays
    home/               Dashboard, settings, and onboarding surfaces
    properties/         Node, edge, and canvas side panels
    top-nav/            Brand, export, share, and collaboration actions
  config/               Rollout flags and runtime defaults
  hooks/                Canvas/editor hooks and interaction logic
  lib/                  Shared types and utilities
  services/
    collaboration/      Room links, transport bootstrap, sync helpers
    shapeLibrary/       Provider icon catalog loading and previews
    templateLibrary/    Starter template registry and helpers
  store/                Zustand store, defaults, and actions
assets/
  third-party-icons/    Imported provider SVG packs and source metadata
scripts/
  shape-pack/           Intake and validation tooling for icon packs
```

## Development

### Requirements

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
npm run bundle:check
```

### Test

```bash
npm run test -- --run
```

Useful focused suites:

```bash
npm run test:s0
npm run test:s10-state
npm run test:s10-canvas
npm run test:s4-handle-safety
```

## Asset ingestion notes

- AWS, Azure, and CNCF SVG assets are processed into local provider packs under `assets/third-party-icons`.
- Runtime previews are lazy-resolved with `import.meta.glob` so large icon sets do not inflate the main editor entry bundle.
- Provider pack intake and validation scripts live in `scripts/shape-pack`.
- GCP remains blocked until redistribution status changes in [SOURCE.md](/Users/varun/Desktop/Dev_projects/flowmind-ai/assets/third-party-icons/google-cloud/SOURCE.md).

## Key files

- [AssetsView.tsx](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/components/command-bar/AssetsView.tsx)
- [TemplatesView.tsx](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/components/command-bar/TemplatesView.tsx)
- [providerCatalog.ts](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/services/shapeLibrary/providerCatalog.ts)
- [domainLibrary.ts](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/services/domainLibrary.ts)
- [ShareModal.tsx](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/components/ShareModal.tsx)
- [defaults.ts](/Users/varun/Desktop/Dev_projects/flowmind-ai/src/store/defaults.ts)

## Production readiness checklist

- Type-check before shipping.
- Run the full Vitest suite.
- Run `npm run build` and `npm run bundle:check`.
- Validate imported icon packs if asset sources changed.
- Review any rollout-flag defaults before enabling experimental paths globally.

## License and source packs

OpenFlowKit includes first-party code plus separately sourced third-party asset packs. Check the `SOURCE.md` or README files inside `assets/third-party-icons/*` before changing or redistributing provider icons.
