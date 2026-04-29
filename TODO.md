# TODO

Tracks open work and decisions deferred to Jacqueline. Per the brief, never invent data — surface every uncertainty here.

## Open questions for Jacqueline (do not decide unilaterally)

- Final domain name (working title is "Cadastre"; placeholder routing under `cadastre.dancingwithlions.com`).
- Whether the anonymised transaction registry is exposed publicly in Phase 1 or held for a gated tier.
- Whether the About page should mention Dancing with Lions parentage or stand fully independent.
- Country priority order beyond Morocco → Tunisia (currently: Senegal, Egypt, Côte d’Ivoire, then Anglophone tier).

## Phase 1 Weeks 4–6 (deferred from this scaffolding pass)

### Data ingestion (Week 4)

All `data/processed/*.json` currently ship as empty arrays with `manifest.status: "pending"`. ETL stubs in `data/scripts/` need real implementations:

- `bkam/fetch-ipai.ts` + `bkam/process-ipai.ts` — Bank Al-Maghrib IPAI quarterly index, 2006-Q1 → latest, three segments (residential, commercial, land).
- `hcp/fetch-population.ts` — HCP Marrakech-Safi population, urbanisation, household income.
- `office-changes/fetch-mre.ts` — Office des Changes monthly MRE remittances and FDI by sector.
- `microsoft-buildings/fetch-marrakech.ts` — Microsoft + Meta footprints merged for the Marrakech bounding box.
- `ghsl/fetch-built-up.ts` — GHSL built-up rasters for 1990 / 2000 / 2010 / 2020.
- `listings/scrape-mubawab.ts`, `listings/scrape-properstar.ts` — Phase 2.
- Anonymised transaction registry ingestion (subject to Jacqueline’s decision on public surfacing).

### Mapbox (Week 5)

- Custom style starting from Mapbox Light, stripped: no 3D buildings on data maps, label minimum-zoom raised, `#fafafa` background, `#d4d4d4` 0.5-weight borders.
- Quarter, city, country boundaries as GeoJSON in `public/geo/`. Currently only one placeholder polygon (`ma-marrakech-laksour.geojson`); replace with surveyed boundaries and add the remaining nine Marrakech quarters.
- Building footprints served as MBTiles via tile endpoint.
- GHSL urban-expansion temporal slider (1990/2000/2010/2020).
- Drill-down flow: continental → country → city → quarter using `flyTo` with 1200 ms cubic-out.

### Polish + ship (Week 6)

- Lighthouse 95+ audit on all entity pages.
- axe-core / WCAG AA pass.
- `safeSitemapUrl()` pattern from Slow Morocco — currently inlined, port the proper implementation.
- Vercel deploy under `cadastre.dancingwithlions.com`.

### Legal corpus

- Index Law 39-08 article-by-article (FR canonical, EN working translation), with article anchors.
- Add notarial + ANCFCC fee schedules as structured data (currently absent).
- Reach 30 glossary terms (currently 14).
- Reach the seven Phase 1 legal concepts: melkia, titre foncier, immatriculation, adoul, mandat exclusif, compromis, acte authentique — done, plus ANCFCC.

### Content gaps

- City pages for Casablanca and Rabat are stubs (frontmatter only, no quarters).
- Tunisia is a stub; Senegal, Egypt, Côte d’Ivoire to be added per priority order.

## Architectural debt

- `_dev/` Storybook-style example routes are not yet implemented (brief Section 6.4).
- 90-day freshness gate on "live" datasets is not yet enforced at build time.
- Transaction registry public-surface gating logic depends on Jacqueline’s decision.
