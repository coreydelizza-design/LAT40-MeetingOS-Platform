# LAT40 MeetingOS

**An executive operating workspace that governs live time, structures decisions, deploys org-based agents, and maps how the organization actually works.**

LAT40 MeetingOS treats a meeting as a **governed work object**, not a calendar event. It is not a meeting recorder, a calendar clone, a dashboard, a chatbot, or a transcript viewer. The interface is a **black-and-white executive decision room** — monochrome, editorial, sparse, and serious.

The platform helps an organization answer:

- Should this meeting exist?
- What outcome is required?
- Who truly needs to attend?
- Can an agent attend instead?
- What decision, risk, action, or dependency must be captured?
- What does meeting activity reveal about how the organization actually works?

---

## Core modules

| Module | Purpose |
| --- | --- |
| **App Shell** (Today) | Executive Alignment Room — the operating stance and daily briefing. |
| **Smart Calendar** | Time-governance cockpit: where organizational attention is being spent. |
| **Build Smart Meeting** | Moderated intake that starts from outcome, not date — produces a Meeting Contract. |
| **Org Cards** | Operating profiles of each organization: what it owns, needs, decides, and escalates. |
| **Decision Room** | Moderated room to govern a decision to close, with a required capture. |
| **Agents** | Governed representation layer — agents extend coverage, never replace accountability. |
| **Structured Capture** | The evidence ledger: decisions, actions, dependencies, risks, org summaries, scores. |
| **Work Map** | Work Reality Map — decision flow, dependency, friction, meeting debt, org load. |
| **Executive Review** | Leadership operating review of live time, decision velocity, friction, and agent leverage. |

---

## Visual direction

Black-and-white executive decision room, **not a dashboard**.

- Monochrome only — black, white, off-white, charcoal, graphite, smoke, subtle gray.
- Editorial hierarchy: serif display headings, small uppercase labels, serious language.
- Thin rules, structured panels, large negative space.
- No bright colors, gradients, colorful KPI cards, decorative icons, or bubbly SaaS cards.

The full design system lives in `src/styles/global.css`.

---

## Current implementation status

**Frontend-first, static/mock data.** Every screen renders from typed mock data in `src/data/mock.ts`. There is no backend of any kind.

### Stack

- **Vite 8 + React 18 + TypeScript (strict)** — no UI library, no router library, no chart library, no icon pack.
- Routing is a dependency-free internal view-state switch (`src/App.tsx`).
- Runtime dependencies: `react`, `react-dom`, and `serve` (static file server for production) only.
- Requires **Node ≥ 20.19** (Vite 8 engine requirement).

### Project structure

```
src/
  App.tsx               internal view router
  main.tsx              entry
  constants.ts          product constants + left-rail nav
  types.ts              domain type spine (governed work objects)
  data/mock.ts          all frontend mock data
  styles/global.css     the monochrome design system
  components/
    AppShell.tsx        command bar + left rail + canvas
    primitives.tsx      SectionHeader, ExecPanel, StatusLabel, ModeratorPanel,
                        ContractBlock, KVPanel, BulletList, …
  screens/              one file per module
```

## What is intentionally **not** built yet

- Database / persistence
- Authentication & permissions model
- Calendar API (Google / Outlook)
- Teams / Zoom integrations
- Real meeting transcription
- Real agent runtime
- Server-side org-specific summary generation

These are deliberately excluded to keep the build frontend-only and deployable on Railway at every phase.

## Recommended next technical phases

- **Phase A** — Frontend polish and state cohesion
- **Phase B** — Persistence layer
- **Phase C** — Calendar integration
- **Phase D** — Meeting transcript ingestion
- **Phase E** — Org-specific summary generation
- **Phase F** — Agent attendance workflow
- **Phase G** — Enterprise permissions and governance
- **Phase H** — Work Map analytics from real data

---

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build              # tsc typecheck + vite production build → dist/
npx serve -s dist -l 4173  # serve the production build locally (same as prod)
npm run typecheck          # type check only
```

## Railway deployment

MeetingOS is a static frontend. `vite build` emits `dist/`, which is served in production by the `serve` package — a static file server, not a dev/preview server. No environment variables are required.

- **Build command:** `npm run build` → `tsc && vite build` → `dist/`
- **Start command:** `npm run start` → `serve -s dist -l ${PORT:-4173}`
  - `-s` enables SPA fallback (all routes serve `index.html`); `-l` binds Railway's injected `$PORT`.
- Config is declared in `railway.json` (Nixpacks builder). `vite.config.ts` has **no `preview` block and no `allowedHosts`** — host-header validation is not bypassed anywhere.

Railway builds from the connected GitHub repo. Push to the default branch and Railway will build and deploy automatically.
