/**
 * Fetches HCP Morocco population, urbanisation and household statistics into
 * data/raw/hcp/ and processes them into data/processed/hcp-population.json.
 *
 * Implementation pending — this is a scaffolding stub. See TODO.md.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

async function main(): Promise<void> {
  mkdirSync(join(process.cwd(), 'data', 'raw', 'hcp'), { recursive: true });
  const out = {
    manifest: {
      source_url: 'https://www.hcp.ma/',
      fetched_at: null,
      row_count: 0,
      schema_hash: null,
      status: 'pending' as const,
      notes: 'Stub — fetch + process implementation pending.'
    },
    rows: [] as { region: string; year: number; population: number; households: number }[]
  };
  writeFileSync(
    join(process.cwd(), 'data', 'processed', 'hcp-population.json'),
    JSON.stringify(out, null, 2)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
