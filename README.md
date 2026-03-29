<div align="center">

<img src="public/favicon.svg" width="80" alt="OpenFlowKit" />

<br/>
<br/>

# OpenFlowKit

### The open-source diagramming workspace built for developers.

<br/>

```
Paste a GitHub URL    →  architecture diagram
Paste SQL             →  entity-relationship diagram
Paste Terraform       →  cloud infrastructure map
Describe your system  →  watch it appear
```

<br/>

**No account. No upload. No lock-in. Runs entirely in your browser.**<br/>
**Every API key stays local. Every diagram is yours.**

<br/>

<p>
  <a href="https://github.com/Vrun-design/openflowkit/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-f97316.svg?style=flat-square" alt="MIT License" /></a>
  <a href="https://github.com/Vrun-design/openflowkit/stargazers"><img src="https://img.shields.io/github/stars/Vrun-design/openflowkit?style=flat-square&color=facc15&label=Stars" alt="GitHub Stars" /></a>
  <a href="https://github.com/Vrun-design/openflowkit/actions"><img src="https://img.shields.io/github/actions/workflow/status/Vrun-design/openflowkit/quality.yml?style=flat-square&label=CI" alt="CI" /></a>
  <img src="https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6.svg?style=flat-square" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/PRs-Welcome-2dd4bf.svg?style=flat-square" alt="PRs Welcome" />
</p>

<p>
  <a href="https://app.openflowkit.com"><strong>→ Try it live — no account needed</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://openflowkit.com">Website</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://docs.openflowkit.com">Docs</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://github.com/Vrun-design/openflowkit/issues/new?template=bug_report.md">Report a Bug</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://github.com/Vrun-design/openflowkit/issues/new?template=feature_request.md">Request a Feature</a>
</p>

<br/>

<a href="https://www.producthunt.com/products/openflowkit" target="_blank">
  <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=1081019&theme=light&period=weekly&topic_id=44" alt="OpenFlowKit on Product Hunt" width="200" height="43" />
</a>

<br/>
<br/>

<!-- Replace with actual screenshot or GIF -->
![OpenFlowKit Demo](assets/hero-demo.gif)

</div>

<br/>

---

## Why OpenFlowKit?

Every diagramming tool makes a compromise. OpenFlowKit doesn't.

| Tool | What's missing |
|---|---|
| **Excalidraw / tldraw** | Freeform whiteboards — no structured diagram types, no DSL, no code imports |
| **Mermaid.js** | Code-only — no visual canvas, no AI, no interactive editor |
| **Draw.io** | Decade-old UX — no AI integration, no developer import pipelines |
| **Lucidchart / Miro** | Cloud lock-in — expensive, account required, your data lives on their servers |
| **PlantUML** | Server-dependent rendering — no visual editor, no local-first model |

OpenFlowKit is the **only MIT-licensed tool** that combines a professional visual canvas, bidirectional diagram-as-code, AI generation from 9 providers, deterministic code imports, real-time P2P collaboration, and cinematic animated export — with zero server-side storage.

---

## Feature highlights

| | OpenFlowKit | Excalidraw | Draw.io | Mermaid | Lucidchart |
|---|:---:|:---:|:---:|:---:|:---:|
| Visual canvas editor | ✅ | ✅ | ✅ | ❌ | ✅ |
| Bidirectional diagram-as-code | ✅ | ❌ | ❌ | ✅ | ❌ |
| AI generation (9 providers) | ✅ | ❌ | ❌ | ❌ | Limited |
| GitHub repo → diagram | ✅ | ❌ | ❌ | ❌ | ❌ |
| SQL → ERD (native parser) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Terraform / K8s / Docker import | ✅ | ❌ | ❌ | ❌ | ❌ |
| AWS / Azure / GCP / CNCF icons | ✅ | ❌ | ✅ | Partial | ✅ |
| Real-time collaboration (P2P) | ✅ | ✅ | ❌ | ❌ | ✅ (cloud) |
| Cinematic animated export | ✅ | ❌ | ❌ | ❌ | ❌ |
| Figma export (editable SVG) | ✅ | ❌ | ❌ | ❌ | ❌ |
| No account required | ✅ | ✅ | ✅ | ✅ | ❌ |
| Open source (MIT) | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## Code → Diagram — no AI key required

Drop in your existing artifacts. Most formats are handled by **deterministic native parsers** that run entirely in your browser — no API call, no roundtrip, instant result.

```
github.com/vercel/next.js       →  full architecture diagram
```

```sql
CREATE TABLE orders (
  id       BIGINT PRIMARY KEY,
  user_id  BIGINT NOT NULL REFERENCES users(id),
  status   ENUM('pending','paid','shipped') NOT NULL
);
```
→ Typed ERD with inferred foreign-key edges and cardinalities. Rendered in milliseconds, no server involved.

```yaml
# docker-compose.yml
services:
  api:
    depends_on: [postgres, redis]
  postgres:
    image: postgres:16
  redis:
    image: redis:alpine
```
→ Service architecture with `depends_on` edges and port labels.

| Source | Engine | API key? |
|---|---|:---:|
| GitHub repo URL | AI · 9 languages supported | Yes |
| SQL DDL | Native parser | **No** |
| Terraform `.tfstate` | Native parser | **No** |
| Kubernetes YAML / Helm | Native parser | **No** |
| Docker Compose | Native parser | **No** |
| OpenAPI / Swagger spec | AI-assisted | Yes |
| Source code (single file) | AI-assisted · 9 languages | Yes |
| Mermaid | Native parser | **No** |

---

## Flowpilot — AI generation with any model

Flowpilot sits directly in the editor. Describe a system, paste source code, upload a screenshot, or ask it to refine what's already on the canvas. Your API key is stored in your browser and sent directly to the provider — OpenFlowKit's servers never see it.

**9 providers. Bring your own key. Switch any time.**

| Provider | Default model | Why use it |
|---|---|---|
| Google Gemini | `gemini-2.5-flash-lite` | Free tier available, fast, browser-safe |
| OpenAI | `gpt-5-mini` | Best reasoning for complex architectures |
| Anthropic Claude | `claude-sonnet-4-6` | Excellent code and system understanding |
| Groq | `llama-4-scout-17b-16e-instruct` | Fastest inference available |
| Mistral | `mistral-medium-latest` | Strong European privacy-first alternative |
| NVIDIA NIM | `llama-4-scout-17b-16e-instruct` | Enterprise GPU inference |
| Cerebras | `gpt-oss-120b` | Fastest on WSE-3 silicon |
| OpenRouter | `google/gemini-2.5-flash` | Access 100+ models through one key |
| **Custom endpoint** | Any model | Ollama, LM Studio, or any OpenAI-compatible API |

No proxy. No middleman. Direct browser-to-provider requests.

---

## OpenFlow DSL — diagram as code

Every diagram has a live code panel. Edit the canvas → code updates. Edit the code → canvas updates. Two-way, always in sync.

```
flowchart TB
  client[React App]   --> gateway[API Gateway]
  gateway             --> auth[Auth Service]
  gateway             --> orders[Orders Service]
  orders              --> db[(PostgreSQL)]
  orders              --> cache[(Redis)]
  auth                --> db
```

- Mermaid-compatible syntax
- Export to Mermaid, PlantUML, or JSON
- Paste any Mermaid diagram and it renders immediately
- Version snapshots — restore any previous state

---

## 8 structured diagram families

Not a freeform whiteboard. Structured diagram types with opinionated defaults, correct relationship semantics, and purpose-built node styles.

- **🔷 Flowcharts** — processes, decision trees, system flows
- **☁️ Architecture** — AWS / Azure / GCP / CNCF cloud provider icons built in
- **🗄️ Entity-Relationship** — typed fields, FK edges, one-to-many / many-to-many notation
- **📐 Class diagrams** — UML with inheritance, composition, and interface relationships
- **↔️ Sequence diagrams** — async messages, actors, and lifelines
- **🧠 Mind maps** — collapsible radial trees with auto-layout
- **🛤️ User journeys** — steps, phases, and sentiment scoring
- **⚙️ State machines** — transitions, guards, entry and exit actions

---

## Export everywhere

Build your diagram once. Take it anywhere.

- **PNG / SVG** — transparent background, pixel-perfect at any resolution
- **PDF** — print-ready, vector-crisp
- **Mermaid** — paste directly into GitHub READMEs, Notion, Confluence, Linear
- **PlantUML** — for enterprise toolchains and legacy integrations
- **Figma** — full editable SVG import with preserved layers
- **JSON** — complete round-trip import/export, no data loss
- **🎬 Cinematic MP4** — an animated walkthrough of your diagram, node by node, edge by edge. Designed for demos, presentations, and architecture reviews. No other open-source diagramming tool does this.

---

## Real-time collaboration — no server

P2P collaboration over WebRTC. Share a link, edit together in real time. Presence indicators, cursor sync, live conflict resolution. Nothing routes through a server you don't control.

---

## Canvas built for keyboard-first developers

| Shortcut | Action |
|---|---|
| `⌘ K` / `Ctrl K` | Command bar — search, import, export, run any action |
| `⌘ \` / `Ctrl \` | Toggle the live code panel |
| `⌘ Z` / `Ctrl Z` | Full undo with complete history |
| `⌘ D` / `Ctrl D` | Duplicate selection |
| `⌘ G` / `Ctrl G` | Group selected nodes |
| `⌘ /` / `Ctrl /` | Keyboard shortcuts reference |

Plus: smart alignment guides, snap-to-grid, multi-select, layers panel, sections, architecture lint, light/dark/system theme, and full i18n in 7 languages.

---

## Get started in 30 seconds

```bash
git clone https://github.com/Vrun-design/openflowkit.git
cd openflowkit
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Done.

> **Zero environment variables required.** AI provider keys are configured in the in-app settings panel at runtime — nothing goes in `.env`.

---

## Self-host

OpenFlowKit is a pure static SPA. There is no backend. Deploy the `dist/` folder anywhere that serves HTML.

**Cloudflare Pages / Netlify / Vercel:**
```bash
npm run build
# upload dist/ to your provider
```

**Docker:**
```bash
docker build -t openflowkit .
docker run -p 8080:80 openflowkit
```

No database. No secrets. No infrastructure. One folder.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5 |
| Build | Vite 6 |
| Canvas | React Flow (XYFlow) |
| Auto-layout | ELK.js |
| State | Zustand |
| Storage | IndexedDB — local-first, no backend |
| Styling | Tailwind CSS |
| Collaboration | WebRTC (P2P, no relay server) |
| i18n | react-i18next — 7 languages |
| Testing | Vitest + Playwright |

---

## Contributing

All contributions are welcome — bug fixes, new diagram types, parser improvements, translations, and documentation.

Start here:

```bash
npm run dev        # development server at localhost:5173
npm run test       # unit tests via Vitest
npm run test:e2e   # end-to-end tests via Playwright
npm run lint       # ESLint + TypeScript type-check
```

**Good first issues** are tagged [`good first issue`](https://github.com/Vrun-design/openflowkit/labels/good%20first%20issue). Before opening a PR, please read [CONTRIBUTING.md](CONTRIBUTING.md).

If OpenFlowKit saves you time, the single best thing you can do is **[⭐ star it on GitHub](https://github.com/Vrun-design/openflowkit)**. It helps other developers find the project and keeps the momentum going.

---

## License

MIT — free to use, self-host, fork, and build on. See [LICENSE](LICENSE).

---

<div align="center">

Built by the [OpenFlowKit contributors](https://github.com/Vrun-design/openflowkit/graphs/contributors).

<br/>

[![Stars](https://img.shields.io/github/stars/Vrun-design/openflowkit?style=social)](https://github.com/Vrun-design/openflowkit/stargazers)

<br/>

If this project is useful to you, a star means the world. Thank you. 🙏

<br/>

**[→ Try OpenFlowKit — no account, no install](https://app.openflowkit.com)**

</div>
