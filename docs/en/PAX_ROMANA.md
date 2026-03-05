# PAX ROMANA — The OpenFlowKit Master Plan

> *"Pax Romana" — a long period of relative peace and stability. A golden era built on strong foundations.*
>
> **Mission**: Build the best diagramming tool in the world. Open source. Local-first. Zero server bills. Forever free.
> Beat Figma, Lucidchart, Whimsical, draw.io, and Excalidraw — not by copying them, but by doing what none of them can: AI-native, privacy-first, and unstoppable at any scale.

---

## The North Star

| Pillar | What it means |
|---|---|
| **Best in class diagrams** | Every diagram type renders at the quality of a professional design tool |
| **Local-first, forever** | Your data never touches a server unless *you* choose to share it |
| **Zero-dollar architecture** | 100,000 users tomorrow = $0 extra cost |
| **AI-native, not AI-bolted-on** | AI understands the diagram, not just generates it |
| **Truly open** | MIT license, no telemetry by default, no vendor lock-in |

---

## Where We Are Today (Honest Score)

| Area | Score | Gap |
|---|---|---|
| Core canvas UX | 6.5/10 | Missing quick-add, drag-to-create, alignment guides |
| Diagram visual quality | 6/10 | No node fills, animated edges, invisible handles |
| Mermaid fidelity | 7/10 | Parse: good. Export: broken. No live editor. |
| AI generation | 6/10 | Generates diagrams, doesn't understand them |
| Shape/template library | 4/10 | ~20 shapes vs draw.io's 5000+ |
| Performance at scale | 7.5/10 | Large graph safety mode works, needs more refinement |
| Infrastructure | 5/10 | localStorage gaps, no IndexedDB, no P2P collab yet |
| Collaboration | 0/10 | Not built yet |
| Extensibility | 2/10 | No plugin system |

**Overall: ~65% of the way to "best in world."**

---

## Phase 0 — Foundation Quality (Now → Q2 2026)
*Make what exists actually great before adding more.*

### 0A · Visual Quality — First Impressions Matter

Every diagram should look like it was designed, not generated.

**Node fills** — Replace all-white backgrounds with tinted pastel fills per color theme. `theme.ts` currently sets `bg-white` for every color. Fix: `bg-violet-50`, `bg-blue-50`, etc.

**Remove animated edges as default** — Marching dashes make diagrams look unstable. Set `animated: false` as default; keep as opt-in toggle. Edge color: `#64748b` (darker, more readable).

**Always-visible connection handles** — Current: `opacity-0 group-hover:opacity-100`. Fix: `opacity-30` always, full on hover. Add a larger 24×24px invisible click target via CSS `::after`.

**Edge labels — pill style** — Replace floating white box (`rounded border shadow-sm`) with a pill (`rounded-full bg-white/90 ring-1`).

**Canvas background** — Finer dot grid: `gap=24, size=1, color=rgba(148,163,184,0.35)`.

**Selection state** — Replace `ring-offset-4` (creates a gap) with `box-shadow: 0 0 0 2px #6366f1, 0 0 12px rgba(99,102,241,0.2)`.

**Typography** — `font-semibold` (not bold), `text-[13px]`, `line-clamp-3` on labels.

### 0B · Canvas Micro-Interactions — The Feel

These are what make users say "this feels amazing":

- **Double-click empty canvas** → create a node at that position (Excalidraw does this perfectly)
- **Drag from node edge handle** → create + connect a new node in one gesture (Whimsical standard)
- **Smart alignment guides** → snap lines appear between nodes while dragging, showing when horizontally/vertically aligned
- **Right-click context menu on canvas** — improved with more actions (paste, select all, add node, fit view)
- **Click edge to add a waypoint** — drag the edge midpoint to bend it
- **Floating quick toolbar on selection** — small toolbar appearing above selected node(s) with: Delete, Duplicate, Color picker, Add connected node
- **Tab key to create next node** — in inline text edit, Tab creates a connected sibling
- **F2 to enter label edit mode** on selected node (keyboard first)

### 0C · Diagram Type Quality (See DIAGRAM_QUALITY_MASTER_PLAN.md for full detail)

- **ClassNode**: Colored visibility modifiers (+/-/#/~), proper UML separators
- **EntityNode**: PK/FK/type three-column layout, key badges
- **MindmapNode**: Depth-based color hierarchy (L0=dark, L1=accent, L2=light, L3+=minimal)
- **Mindmap icons**: Parse `::icon(fa:wifi)` → map to Lucide icon → render in node
- **JourneyNode**: Replace score as `4/5` with visual dot indicators (●●●●○)
- **ArchitectureNode**: Wire `archBoundaryId` → ReactFlow `parentNode` + `extent: 'parent'` so groups visually contain children
- **stateDiagram**: Build dedicated plugin — `[*]` pseudo-states, composite states, fork/join, notes

### 0D · Mermaid Bi-Directional Sync

- **Live Code Editor Panel** — slide-in right panel showing current Mermaid. Edit code → canvas updates (300ms debounce). Edit canvas → code updates. Status bar: ✅ Valid / ⚠ 2 warnings / ❌ Parse error.
- **Fix the exporter** — `toMermaid()` currently emits all edges as `-->`. Fix to preserve `==>` (thick), `-.->` (dashed), `<-->` (bidirectional), `linkStyle` for colors.
- **Per-diagram-type exporters** — classDiagram, erDiagram, mindmap, journey, stateDiagram, architecture all need dedicated serializers.
- **Surface diagnostics** — parser warnings are currently silently dropped. Show as toast + in code panel.

### 0E · Infrastructure Upgrade — Zero-Dollar Architecture

**Current problem**: Diagrams stored in `localStorage` (5MB limit, slow, can be wiped by browser).

**Fix — IndexedDB via Dexie.js**:

```typescript
// src/services/diagramStorage.ts [NEW]
import Dexie, { type Table } from 'dexie';

class OpenFlowKitDB extends Dexie {
  diagrams!: Table<{ id: string; name: string; nodes: any[]; edges: any[]; updatedAt: number }>;
  constructor() {
    super('OpenFlowKit');
    this.version(1).stores({ diagrams: 'id, updatedAt' });
  }
}
export const db = new OpenFlowKitDB();
```

- Auto-save every 2 seconds (debounced) — no more lost work on crash
- Request `navigator.storage.persist()` on first save — prevents browser from wiping data
- IndexedDB capacity: up to 80% of user's disk — effectively unlimited

**Migration path**: Detect existing `localStorage` data on first load → migrate to IndexedDB → clear localStorage.

---

## Phase 1 — Shape & Template Library (Q2-Q3 2026)
*The single biggest gap vs draw.io. A diagramming tool without shapes is an empty canvas.*

### 1A · Core Shape Packs

**Infrastructure & Cloud** (free SVG icon sources):
- AWS icons (official open-source SVG pack, 500+ icons) — EC2, S3, Lambda, RDS, VPC, etc.
- GCP icons (official open-source) — Compute Engine, Cloud Storage, BigQuery, etc.
- Azure icons (official open-source) — App Service, Functions, CosmosDB, etc.
- Kubernetes icons — Pod, Service, Deployment, Namespace, etc.
- Docker/container icons — Container, Volume, Network

**Network & Security**:
- Network topology: Router, Switch, Firewall, Load Balancer, DNS, CDN
- Security: Shield, Lock, Certificate, Vault, WAF

**Software Development**:
- UML extension: Actor, Use Case, Boundary, Control, Entity (for use case diagrams)
- BPMN basics: Start/End events, Task, Gateway, Pool, Lane
- Sequence diagram actors and lifelines

**Business**:
- Org chart: Person, Team, Department
- Process: Start, End, Decision, Manual step, Automated step, Data store

**Implementation**: Icon packs stored in `src/services/shapeLibrary/` as JSON manifests pointing to optimized SVG strings. The existing `IconPicker.tsx` becomes a full shape browser panel.

### 1B · Template Library — 50+ Templates

Templates are the #1 onboarding tool. New user → clicks template → instantly has a complete diagram they can edit.

**Developer templates**:
- Microservices architecture (5-service system with API gateway, auth, DB)
- CI/CD pipeline (GitHub → Build → Test → Deploy → Monitor)
- AWS 3-tier web app (ELB → EC2 → RDS, with VPC and subnets)
- Kubernetes cluster layout
- System context diagram (C4 Model Level 1)
- Container diagram (C4 Model Level 2)
- Event-driven architecture (Event bus, producers, consumers)
- Database ER diagram (e-commerce: User, Order, Product, Payment)

**Business & Product**:
- User journey map (5-step checkout flow)
- Org chart (3-level company structure)
- Sprint planning board (Backlog → In Progress → Review → Done)
- Customer onboarding flow
- Feature decision tree
- OKR hierarchy diagram

**Education & Concept**:
- Mind map (project planning, 3-level)
- Comparison matrix
- Timeline (6-milestone project)
- Concept map

**UML**:
- Class diagram (Library system: Book, User, Loan)
- State machine (Order lifecycle)
- Sequence diagram (API authentication flow)

Each template ships with proper ELK layout pre-applied, good colors, and meaningful labels.

### 1C · Plugin/Extension System (Shape Library API)

Allow teams to add custom shape packs:

```typescript
// Plugin shape pack manifest
interface ShapePackManifest {
  id: string;
  name: string;          // "Acme Corp Icons"
  version: string;
  author: string;
  shapes: ShapeDefinition[];
}

interface ShapeDefinition {
  id: string;
  label: string;
  category: string;
  svgContent: string;    // Inlined SVG for offline use
  defaultWidth: number;
  defaultHeight: number;
  nodeType: 'custom' | 'architecture' | string;
  defaultData: Partial<NodeData>;
}
```

Load packs from: a JSON URL, a local file import, or a curated registry.

---

## Phase 2 — AI That Understands (Q3 2026)
*Go from "AI generates diagrams" to "AI is a collaborator that understands your work."*

### 2A · Context-Aware Generation

Current: User says "draw a microservices architecture" → AI generates generic Mermaid → parse → canvas.

Better: AI looks at what's already on the canvas before generating:

```typescript
// Send existing diagram context with the generation request
const systemPrompt = `You are a diagram architect.
Current diagram context: ${serializeCanvasContext(nodes, edges)}
User's instruction: ${userMessage}
Generate Mermaid code that EXTENDS or MODIFIES the existing diagram, not a fresh one.`;
```

Features:
- **Extend mode**: "Add a caching layer" → AI adds Redis node between App and DB in the existing diagram
- **Explain mode**: "Explain this diagram" → AI describes what the current canvas shows
- **Critique mode**: "What's wrong with this architecture?" → AI identifies missing components, anti-patterns
- **Refactor mode**: "Simplify this flow" → AI reorganizes the diagram preserving key relationships

### 2B · Copilot Mode

**Node autocomplete**: While dragging from a handle to connect, AI suggests the 3 most likely next nodes based on context. E.g., if you have "API Gateway" selected and start dragging → suggests: "Auth Service", "Rate Limiter", "Load Balancer".

**Smart labeling**: Select an edge with no label → "Suggest label" → AI suggests based on source/target node names.

**Layout intelligence**: "Make this easier to read" → AI picks the best ELK layout algorithm and direction based on diagram type.

### 2C · Local LLM Support (Ollama)

For air-gapped, 100% offline generation:

```typescript
const OLLAMA_PROVIDER: AIProvider = {
  id: 'ollama',
  name: 'Ollama (Local)',
  baseUrl: 'http://localhost:11434',
  models: ['llama3:8b', 'mistral:7b', 'codellama:13b'],
  requiresKey: false,
  supportsStreaming: true,
};
```

No API key needed. User installs Ollama locally, picks a model, generates diagrams 100% offline.

---

## Phase 3 — Real-Time Collaboration (Q4 2026)
*P2P, no server costs, Figma-quality experience.*

### 3A · Yjs + y-webrtc Sync

```typescript
// src/services/collaboration/ySync.ts [NEW]
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

const ydoc = new Y.Doc();
const provider = new WebrtcProvider(roomId, ydoc, {
  signaling: ['wss://signaling.yjs.dev'], // Free community signaling server
});

// Shared data structures
const yNodes = ydoc.getMap<FlowNode>('nodes');
const yEdges = ydoc.getMap<FlowEdge>('edges');

// Awareness (cursors, names, colors)
const awareness = provider.awareness;
awareness.setLocalState({
  name: userName,
  color: userColor,
  cursor: { x: 0, y: 0 },
});
```

**What syncs**: Node positions, labels, edge connections, node creation/deletion, edge creation/deletion.

**What doesn't sync** (stays local): AI API keys (NEVER), view position/zoom (each user has their own view), selected nodes.

**Cost**: $0. WebRTC is peer-to-peer. The signaling server (just for establishing the connection) uses the free community yjs.dev server. Once connected, data flows directly browser-to-browser.

### 3B · Live Cursors & Presence

```tsx
// Each remote user's cursor:
<RemoteCursor
  name={presence.name}
  color={presence.color}
  x={presence.cursor.x}
  y={presence.cursor.y}
/>
// Shown in top bar: "2 others viewing" with colored avatar dots
```

### 3C · Contextual Comments

Pin comments to any node or edge:
- `Ctrl+Click` on a node → opens comment thread
- Comments have `@mention` support
- Comments marked as resolved collapse to a small indicator dot
- Comments are part of the Yjs document (sync in real-time)

### 3D · Share Links

Powered by `lz-string` compression:

```typescript
// Sharing flow:
// 1. Serialize nodes + edges (strip API key)
// 2. JSON.stringify → LZ-String compress → base64
// 3. Put in URL: openflowkit.app/view#d=<compressed>

// For large diagrams (>2000 chars compressed):
// 4. POST to Cloudflare Worker → creates Secret GitHub Gist
// 5. URL becomes: openflowkit.app/view?gist=<gistId>
// Security: API keys are NEVER included. Recipient sees diagram, uses their own key for AI.
```

**API key safety rule**: The `sanitizeDiagramForSharing()` function strips any key-containing fields before any export or share operation.

---

## Phase 4 — Platform Era (2027)
*Deep ecosystem integration. This is where you win the enterprise market while staying free.*

### 4A · IDE Extensions

**VS Code Extension**:
- Open any `.mermaid`, `.flow`, or `.ofk` file → renders in a split pane using OpenFlowKit canvas
- Edit the code → canvas updates live (the live code editor panel, but in VS Code)
- Edit the canvas → code file updates
- Command palette: "OpenFlowKit: New diagram from selection" — takes selected code, runs AI, opens diagram

**GitHub Integration**:
- `.github/workflows/diagram-preview.yml` — on PR, renders any changed `.mermaid` files as PNG previews in PR comments
- No server needed: runs as a GitHub Action using a headless browser

### 4B · Data-Driven Diagrams

**SQL → ER Diagram**:
```typescript
// Connect to any DB (runs entirely locally via WASM SQLite or user-provided connection)
// Parse schema → auto-generate erDiagram with all tables, columns, PKs, FKs, relationships
const generateERD = async (connectionString: string) => {
  const schema = await introspectSchema(connectionString);
  const mermaid = schemaToERD(schema);
  return parseMermaidByType(mermaid);
};
```

**Live Metric Binding**:
- Bind a node's color/size/label to a REST API endpoint
- Polling interval configurable
- Use case: server health dashboard as a diagram (green = healthy, red = down)

### 4C · Figma Integration

**Export to Figma**: Convert canvas to Figma-compatible JSON (FigJam nodes) and copy to clipboard — already partially implemented via `toFigmaSVG()`.

**Figma → OpenFlowKit**: Parse Figma file exports into canvas nodes. Useful for teams that design in Figma but document in OpenFlowKit.

### 4E · Advanced Export

- **PDF export** — Multi-page PDF for large diagrams (split by print area)
- **SVG export** — Clean, scalable, with proper font embedding
- **Markdown embed** — Generate `![diagram](data:image/svg+xml;base64,...)` for GitHub README embedding
- **Notion/Confluence embed** — oEmbed support so diagrams render natively in these tools
- **OpenAPI/JSON Schema → Diagram** — Parse an OpenAPI spec and auto-generate the API flow diagram

---

## The Cloudflare Architecture (Full Spec)

Everything runs on Cloudflare. Zero server bills. The full product is a constellation of Cloudflare products working together.

---

### The Big Picture

```
openflowkit.app/              → CF Pages: Marketing site (Astro) — SEO, blog, docs, landing
openflowkit.app/app/*         → CF Pages: The tool (Vite React) — the actual diagramming tool
openflowkit.app/api/*         → CF Workers: Server functions (Gist proxy, signaling fallback)
openflowkit.app/docs/*        → CF Pages: Docs site (Starlight/Astro) — guides, API reference
```

All four live on the same domain, routed by Cloudflare's **Transform Rules** — no CORS issues, no subdomain complexity.

---

### Repo Structure (Monorepo)

The current codebase is one Vite app that serves both the landing page and the tool. That needs to split:

```
openflowkit/                  ← Root monorepo
├── apps/
│   ├── tool/                 ← Current Vite app (the diagramming canvas)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── marketing/            ← NEW: Astro site (landing page, blog, changelog)
│   │   ├── src/
│   │   ├── package.json
│   │   └── astro.config.ts
│   └── docs/                 ← NEW: Starlight/Astro (guides, API reference)
│       ├── src/
│       └── astro.config.ts
├── workers/                  ← NEW: Cloudflare Workers
│   ├── gist-proxy/           ← Share link backend (diagram too big for URL)
│   ├── signaling/            ← Optional: self-hosted WebRTC signaling fallback
│   └── wrangler.toml
├── packages/
│   └── shared/               ← Shared types, utils (NodeData, EdgeData, etc.)
└── package.json              ← Turborepo or pnpm workspaces root
```

**Why the split matters**:
- The marketing site is static HTML + CSS → Google indexes it perfectly → SEO traffic
- The tool is a React SPA → not indexable, but that's fine — it's an app, not content
- Docs are static Markdown → instant search, no JS overhead
- Workers are edge functions → run in 200+ locations, sub-10ms cold start

**Migration path** (do this gradually, not all at once):
1. Extract `LandingPage.tsx` → new Astro `marketing/` app — rewrite as static Astro components
2. Set up Cloudflare Pages for `tool/` (the existing Vite app, nearly zero config change)
3. Add Cloudflare Pages for `marketing/` and point it to `openflowkit.app/`
4. Route `/app/*` to the tool via Transform Rules
5. Add Workers one at a time as features need them

---

### Cloudflare Products Used

#### ① Cloudflare Pages — Static Hosting

Three separate Pages projects, all free:

| Project | Repo Path | Domain |
|---|---|---|
| `ofk-tool` | `apps/tool/` | `app.ofk.pages.dev` → routed to `openflowkit.app/app/*` |
| `ofk-marketing` | `apps/marketing/` | `ofk-marketing.pages.dev` → routed to `openflowkit.app/` |
| `ofk-docs` | `apps/docs/` | `ofk-docs.pages.dev` → routed to `openflowkit.app/docs/*` |

Every PR to `main` gets a preview URL automatically — you can test the tool, marketing site, and docs independently before merging.

Build settings for the tool (nearly same as today):
```toml
# Cloudflare Pages — apps/tool build settings
Build command:   npm run build
Build output:    dist/
Node version:    20
```

#### ② Cloudflare Workers — Edge Functions

**Worker 1: `gist-proxy`** — Share large diagrams
```typescript
// workers/gist-proxy/index.ts
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const { diagram } = await req.json<{ diagram: unknown }>();

    // CRITICAL: Strip API keys before saving anywhere
    const sanitized = sanitizeDiagramForSharing(diagram);

    const gist = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        Authorization: `token ${env.GITHUB_TOKEN}`, // Secret stored in Worker env vars
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: { 'diagram.json': { content: JSON.stringify(sanitized) } },
        public: false,
        description: 'OpenFlowKit shared diagram',
      }),
    });
    const { id } = await gist.json<{ id: string }>();
    return Response.json({ gistId: id });
  },
};
```

**Phase 3 addition**: A `signaling` Worker using Cloudflare Durable Objects for self-hosted WebRTC signaling (so you don't depend on yjs.dev). Add only when building collaboration.

> **What we're NOT using yet**: KV, R2, D1. They're useful for future plugin registries and optional accounts — but add complexity for no benefit now. Add them only when a specific feature genuinely needs them.

---

### Routing: How It All Connects on One Domain

In the Cloudflare dashboard, **Transform Rules** redirect incoming requests:

```
openflowkit.app/app/*    → Rewrite to app.ofk.pages.dev/*
openflowkit.app/docs/*   → Rewrite to ofk-docs.pages.dev/*
openflowkit.app/api/*    → Routes to Workers
openflowkit.app/*        → Serves ofk-marketing.pages.dev (default)
```

The visitor sees `openflowkit.app` everywhere. No CORS issues. Each sub-app deploys independently.

---

### Local Storage Architecture (On-Device)

```
IndexedDB (via Dexie.js)       ← Primary diagram storage (unlimited)
  └── diagrams table           ← All diagrams: nodes, edges, metadata
  └── templates table          ← User's custom templates
  └── shapePackCache table     ← Cached shape pack SVGs for offline use

localStorage                   ← Tiny settings only
  └── theme                   ← 'dark' | 'light' | 'system'
  └── lastActiveTab            ← Resume where you left off
  └── analyticsConsent        ← 'yes' | 'no' | null (consent not yet asked)

SessionStorage                 ← Secrets (cleared on tab close)
  └── ai_api_key_gemini       ← BYOK keys (never persisted across sessions unless user opts in)
  └── ai_api_key_openai
  └── ai_api_key_anthropic
```

**IndexedDB schema via Dexie**:
```typescript
// src/services/db.ts [NEW]
import Dexie, { type Table } from 'dexie';

interface StoredDiagram {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  diagramType?: string;
  createdAt: number;
  updatedAt: number;
  thumbnailDataUrl?: string;  // 200×150 canvas screenshot for gallery view
}

class OpenFlowKitDB extends Dexie {
  diagrams!: Table<StoredDiagram>;
  constructor() {
    super('OpenFlowKit');
    this.version(1).stores({
      diagrams: 'id, updatedAt, diagramType',
    });
  }
}
export const db = new OpenFlowKitDB();

// Auto-save hook (called in useFlowStore)
export const autoSave = debounce(async (diagramId: string, state: FlowState) => {
  await db.diagrams.put({
    id: diagramId,
    ...extractDiagramData(state),
    updatedAt: Date.now(),
  });
}, 2000);
```

On first load, detect existing `localStorage` diagram data → migrate to Dexie → clear old keys.

---

### Sharing Architecture

```
Diagram size after LZ compression   Action
───────────────────────────────────────────────────────
< 2KB                               URL hash: openflowkit.app/view#d=<lz>
2KB – 50KB                          Cloudflare Worker → Secret GitHub Gist → openflowkit.app/view?g=<id>
> 50KB                              Show user a warning + option to download .ofk file to share manually
```

**Security invariant**: `sanitizeDiagramForSharing()` runs before ANY share operation:
```typescript
function sanitizeDiagramForSharing(state: Partial<FlowState>): SafeSharePayload {
  const { nodes, edges, viewport, diagramType } = state;
  // Explicitly allowlist — never include anything else
  return { nodes, edges, viewport, diagramType, version: APP_VERSION };
  // AI keys, user settings, internal IDs: never included
}
```

---

### The Content Sites (Marketing + Docs)

**Marketing site** (`apps/marketing/` — Astro):
```
openflowkit.app/                 Landing page (hero, features, comparisons)
openflowkit.app/blog/            Blog (MDX articles — tutorials, changelogs, comparisons)
openflowkit.app/changelog/       Version history, release notes
openflowkit.app/pricing/         "Always free" page (no pricing, just the pitch)
openflowkit.app/compare/         Compare vs draw.io, Lucidchart, Excalidraw, etc.
```

Astro generates fully static HTML → perfect SEO → Google indexes every page correctly.

**Docs site** (`apps/docs/` — Starlight/Astro):
```
openflowkit.app/docs/            Docs home
openflowkit.app/docs/guides/     User guides (how to create diagrams, use AI, etc.)
openflowkit.app/docs/mermaid/    Mermaid support reference
openflowkit.app/docs/api/        Plugin API reference
openflowkit.app/docs/self-host/  Self-hosting guide
```

Starlight gives you: search (built-in), dark mode, versioning, i18n — all static, zero server.

---

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  pull_request:

jobs:
  deploy-tool:
    uses: cloudflare/pages-action@v1
    with:
      apiToken: ${{ secrets.CF_API_TOKEN }}
      accountId: ${{ secrets.CF_ACCOUNT_ID }}
      projectName: ofk-tool
      directory: apps/tool/dist
      command: cd apps/tool && npm run build

  deploy-marketing:
    uses: cloudflare/pages-action@v1
    with:
      projectName: ofk-marketing
      directory: apps/marketing/dist

  deploy-workers:
    uses: cloudflare/wrangler-action@v3
    with:
      apiToken: ${{ secrets.CF_API_TOKEN }}
      workingDirectory: workers/
```

Every PR → preview URLs for all three sites. Merge to `main` → production deploy. Zero manual steps.

---

### Analytics — $0, Legal, Privacy-First

No signup = no user accounts. Here's how to understand usage without spending anything:

**① Cloudflare Pages Analytics** — built into every Pages project, zero config. Anonymous visitor counts, countries, devices, referrers. No cookies, GDPR-compliant.

**② PostHog (opt-in only, free tier)** — 1M events/month, free forever. Consent banner on first app load (default = No):
```tsx
<ConsentBanner
  message="Help improve OpenFlowKit with anonymous usage data?"
  onAccept={() => { localStorage.setItem('analyticsConsent', 'yes'); posthog.init(KEY); }}
  onDecline={() => localStorage.setItem('analyticsConsent', 'no')}
/>
```
With consent — anonymous feature events, no user ID:
```typescript
posthog.capture('ai_generation', { model: 'gemini', success: true });
posthog.capture('mermaid_pasted', { diagramType: 'classDiagram' });
posthog.capture('share_link_created');
```

**③ GitHub Repo Insights** — free, passive. Stars, traffic, clone counts = developer adoption signal.

| Question | Source |
|---|---|
| How many people visit? | Cloudflare Analytics |
| Which features get used? | PostHog (opted-in) |
| Developer interest? | GitHub stars + traffic |

**Total analytics cost: $0.**

---

### Viral Proof Calculation

| Scale | CF Pages | Gist Worker | PostHog | Total/month |
|---|---|---|---|---|
| 1K users | $0 | $0 | $0 (free tier) | **$0** |
| 10K users | $0 | $0 | $0 (free tier) | **$0** |
| 100K users | $0 | ~$2 | $0 (free tier) | **~$2** |
| 1M users | $0 | ~$20 | $0 (free tier) | **~$20** |

Competitors at 1M users: Miro ~$2M/month. OpenFlowKit: $20/month.

---

## Success Milestones

### Milestone 1 — "It Looks Amazing" (Q2 2026)
- [ ] All nodes have tinted fills, selection glows
- [ ] Edges: static by default, clean arrows
- [ ] Handles always visible at 30% opacity
- [ ] Double-click empty canvas → create node
- [ ] Drag from handle → create + connect
- [ ] Alignment guides while dragging
- [ ] Live Mermaid code editor panel (bi-directional)
- [ ] IndexedDB storage (auto-save, no data loss)

### Milestone 2 — "It Has Everything" (Q3 2026)
- [ ] AWS + GCP + Azure shape packs
- [ ] 50+ templates
- [ ] stateDiagram dedicated plugin
- [ ] ClassNode UML formatting (visibility modifiers)
- [ ] EntityNode PK/FK table layout  
- [ ] MindmapNode depth hierarchy
- [ ] ER crow's foot edge markers
- [ ] Orthogonal edge routing for class/ER
- [ ] Round-trip test suite for all 7 diagram types
- [ ] Local LLM (Ollama) support
- [ ] Context-aware AI (understands current diagram)

### Milestone 3 — "Work Together" (Q4 2026)
- [ ] Yjs real-time collaboration
- [ ] Live cursors and presence
- [ ] Share link (lz-string + Gist fallback)
- [ ] Contextual comments
- [ ] Share strips API keys (security guaranteed)
- [ ] Cloudflare Pages deployment with preview URLs

### Milestone 4 — "Unstoppable Platform" (2027)
- [ ] VS Code extension
- [ ] Plugin/shape pack system
- [ ] SQL → ER auto-generation
- [ ] Live metric binding
- [ ] PDF/SVG export quality
- [ ] Notion/Confluence embed support
- [ ] GitHub Action for PR diagram previews

---

## Competitive Position At Each Milestone

| After M1 | After M2 | After M3 | After M4 |
|---|---|---|---|
| Better visuals than Excalidraw | Better UML than most tools | Only free P2P collab tool | Full enterprise feature set |
| Better AI than draw.io | Best Mermaid support anywhere | Viral sharing model | VS Code + data integration |
| Cleaner than Miro for tech diagrams | Competitive with Lucidchart UML | Beats Miro on cost ($0) | Beats draw.io on extensibility |

---

## What We Deliberately Won't Do (and Why)

| Feature | Why Not |
|---|---|
| **Our own database/backend** | Kills the $0 promise. Users don't trust a startup with their diagrams. |
| **Freemium paywall** | OSS means everything is free. Revenue = sponsorships, consulting, enterprise SLA. |
| **Vendor lock-in format** | Diagrams export as standard Mermaid, JSON, SVG. Always. |
| **Mandatory account/signup** | Local-first means no account needed, ever. |
| **Telemetry without consent** | posthog is already in the codebase — needs an explicit opt-in gate. |

---

*PAX ROMANA — Last Updated: 2026-03-05*
*Codename chosen because empires aren't built in a day, but with the right foundations they last centuries.*
