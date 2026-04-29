/**
 * Processes raw IPAI files in data/raw/bkam/ipai/ into a normalised
 * data/processed/bkam-ipai.json file conforming to the dataset schema.
 *
 * Implementation pending — this is a scaffolding stub. See TODO.md.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'data', 'processed', 'bkam-ipai.json');

async function main(): Promise<void> {
  const payload = {
    manifest: {
      source_url: 'https://www.bkam.ma/',
      fetched_at: null,
      row_count: 0,
      schema_hash: null,
      status: 'pending' as const,
      notes: 'Stub — process implementation pending.'
    },
    rows: [] as { period: string; value: number; segment: string }[]
  };
  writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`[bkam:process-ipai] wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
