# TODO

Tracks open work. Per the brief, never invent data — surface every uncertainty here.

## Decisions on record

- **Working name:** "Cadastre". Final domain TBD; routing parameterised via `NEXT_PUBLIC_SITE_URL`.
- **Anonymised transaction registry:** treated as data. No personal attribution surfaces anywhere on the site.
- **Page voice:** institutional only. No founder bio, no parent-organisation mention, no first-person.
- **Country priority:** Morocco → Tunisia → up-and-coming Anglophone economies (specific country list to be defined when the Tunisia build closes).

## Phase 1 Weeks 4–6 (deferred from this scaffolding pass)

### Data ingestion (Week 4)

All `data/processed/*.json` currently ship as empty arrays with `manifest.status: "pending"`. ETL stubs in `data/scripts/` need real implementations:

- `bkam/fetch-ipai.ts` + `bkam/process-ipai.ts` — Bank Al-Maghrib IPAI quarterly index, 2006-Q1 → latest, three segments (residential, commercial, land).
- `hcp/fetch-population.ts` — HCP Marrakech-Safi population, urbanisation, household income.
- `office-changes/fetch-mre.ts` — Office des Changes monthly MRE remittances and FDI by sector.
- `microsoft-buildings/fetch-marrakech.ts` — Microsoft + Meta footprints merged for the Marrakech bounding box.
- `ghsl/fetch-built-up.ts` — GHSL built-up rasters for 1990 / 2000 / 2010 / 2020.
- `listings/scrape-mubawab.ts`, `listings/scrape-properstar.ts` — Phase 2.
- Anonymised transaction registry ingestion pipeline.

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
- Production deploy once domain is decided (set `NEXT_PUBLIC_SITE_URL`).

### Legal corpus

- Index Law 39-08 article-by-article (FR canonical, EN working translation), with article anchors.
- Add notarial + ANCFCC fee schedules as structured data (currently absent).
- Reach 30 glossary terms (currently 14).
- Phase 1 legal concepts: melkia, titre foncier, immatriculation, adoul, mandat exclusif, compromis, acte authentique, ANCFCC — done.

### Content gaps

- City pages for Casablanca and Rabat are stubs (frontmatter only, no quarters).
- Tunisia is a stub. Define the Anglophone country priority list once Tunisia build is in progress.

## Architectural debt

- `_dev/` Storybook-style example routes are not yet implemented (brief Section 6.4).
- 90-day freshness gate on "live" datasets is not yet enforced at build time.
