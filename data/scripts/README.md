# Data scripts

Per the build brief, every ETL script in this directory must:

1. Be **idempotent** — running twice produces the same result.
2. Write a `manifest.json` next to its output containing `source_url`, `fetched_at`, `row_count`, `schema_hash`, `status`, and any `notes`.
3. **Respect robots.txt** for any scrape.
4. Log license terms and any rate-limit policy applied.
5. Place raw downloads in `data/raw/<source>/` (never modified) and processed JSON/GeoJSON in `data/processed/`.

Build behaviour: `npm run build` reads files from `data/processed/` and warns when a "live" dataset is older than 90 days (configurable per dataset in `content/datasets/*.mdx`).

## Phase 1 scripts to implement

- `bkam/fetch-ipai.ts`, `bkam/process-ipai.ts`
- `hcp/fetch-population.ts`
- `office-changes/fetch-mre.ts`
- `listings/scrape-mubawab.ts`, `listings/scrape-properstar.ts`
- `geo/build-quarter-tiles.ts`
- `microsoft-buildings/fetch-marrakech.ts`
- `ghsl/fetch-built-up.ts`
