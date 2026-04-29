import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

const PROCESSED = path.join(process.cwd(), 'data', 'processed');

export type DataManifest = {
  source_url?: string;
  fetched_at?: string;
  row_count?: number;
  schema_hash?: string;
  status: 'live' | 'pending' | 'stale';
  notes?: string;
};

export type DataFile<T> = {
  manifest: DataManifest;
  rows: T[];
};

export function loadProcessed<T>(filename: string): DataFile<T> | null {
  const file = path.join(PROCESSED, filename);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      manifest: parsed.manifest || { status: 'pending' },
      rows: Array.isArray(parsed.rows) ? parsed.rows : []
    };
  } catch {
    return null;
  }
}
