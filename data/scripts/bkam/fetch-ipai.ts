/**
 * Fetches the Bank Al-Maghrib Property Asset Price Index (IPAI) source files
 * into data/raw/bkam/ipai/ and emits a manifest.json describing the fetch.
 *
 * Idempotent. Respects robots.txt. Writes raw files only — processing is
 * the responsibility of process-ipai.ts.
 *
 * Implementation pending — this is a scaffolding stub. See TODO.md.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_URL = 'https://www.bkam.ma/';
const RAW_DIR = join(process.cwd(), 'data', 'raw', 'bkam', 'ipai');

async function main(): Promise<void> {
  mkdirSync(RAW_DIR, { recursive: true });
  const manifest = {
    source_url: SOURCE_URL,
    fetched_at: null,
    row_count: 0,
    schema_hash: null,
    status: 'pending' as const,
    notes: 'Stub — fetch implementation pending.'
  };
  writeFileSync(join(RAW_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`[bkam:fetch-ipai] manifest written; awaiting implementation.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
