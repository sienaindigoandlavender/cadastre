# Cadastre

Pan-African real estate intelligence — a bilingual (FR/EN) reference platform for land tenure, property markets, cadastral systems, and the built environment across African countries.

This is the implementation of the Phase 1 build brief. See `TODO.md` for outstanding items and the brief's full Phase 1 → Phase 2 plan.

## Stack

- Next.js 14 App Router · TypeScript strict · Tailwind 3.4
- next-intl 3 (path prefix `/en` and `/fr`, default `/fr`)
- Recharts (workhorse), Visx (custom), Framer Motion (transitions)
- Mapbox GL JS 3.x (lazy-loaded)
- gray-matter + zod for build-time MDX frontmatter validation

## Layout

```
app/                                 # Next.js App Router
  [locale]/                          # /en/* and /fr/*
    [country]/                       # country dashboard, scoped by ISO
      cities/                        # cities index
      [city]/                        # city dashboard
        [quarter]/                   # quarter dashboard
        quarters/                    # quarters index
      legal/                         # legal corpus, country-scoped
        [topic]/                     # legal concept page
      datasets/                      # dataset registry
        [id]/                        # dataset detail with chart
    glossary/[term]/                 # continental glossary
    methodology/, sources/, about/
  sitemap.ts, robots.ts
components/
  ui/                                # KpiStat, ChartCard, DataTable, ...
  charts/                            # TimeSeriesChart, DistributionChart, ...
  maps/                              # MapPanel (lazy Mapbox)
  layout/                            # Header, Footer
content/                             # MDX with YAML frontmatter
  countries/, cities/, quarters/, legal/, glossary/, datasets/
data/
  raw/                               # never modified, gitignored
  processed/                         # JSON, consumed by pages, with manifest
  scripts/                           # idempotent ETL
lib/
  content/                           # zod schemas + MDX loader
  i18n/                              # locales, slugs, request config
  format.ts, citations.ts, cn.ts, data/loader.ts
messages/en.json, messages/fr.json   # next-intl messages
public/geo/                          # GeoJSON polygons for quarters
```

## Local development

Requires Node 18+.

```bash
npm install
cp .env.example .env.local
# add NEXT_PUBLIC_MAPBOX_TOKEN if you want maps to render
npm run dev
```

Then visit `http://localhost:3000` (redirects to `/fr`).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build (validates content frontmatter at compile time)
- `npm run start` — start production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript no-emit
- `npm run validate-content` — run zod validation across all MDX frontmatter

## Routing rules

- Path prefix only (`/en`, `/fr`); no subdomain, no cookie.
- `/` redirects to `/fr` (French is the working language for African property law).
- Country slugs differ per locale (`morocco` ↔ `maroc`).
- Legal-concept slugs differ per locale (`customary-title` ↔ `titre-coutumier`).
- ISO 3166-1 alpha-2 (`MA`, `TN`) is the canonical country key internally.

## Content schema

Every MDX file in `content/` carries a strict YAML frontmatter validated by zod (`lib/content/schemas.ts`). A build that contains malformed frontmatter fails. See the build brief for the per-entity schema.

## Provenance

Every chart, every number, every map layer is traceable to a source. Every entity page renders a `CitationBlock` with BibTeX, APA, Chicago, and a permalink. Every dataset registry entry carries publisher, license, fetch method, fetch path, processed path, update frequency, and last-fetched timestamp.

## What this build is

This is the Phase 1 scaffolding (Weeks 1–3 of the brief): full routing tree, design system, content schemas, Morocco populated with 9 Marrakech quarters and 7 legal concepts, 14 glossary terms, 5 dataset registry entries with empty processed-data manifests, methodology and sources pages, sitemap with hreflang.

## What this build is not yet

Phase 1 Weeks 4–6 deliverables (real ETL ingest of BKAM/HCP/OC/buildings/GHSL, custom Mapbox style, full transaction registry surfacing) are flagged in `TODO.md`. Charts render an explicit "data ingestion pending" empty state until ETL scripts run.
