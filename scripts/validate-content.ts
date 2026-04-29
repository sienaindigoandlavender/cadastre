/**
 * Validates all MDX content frontmatter against zod schemas. Run before commit.
 * Exits non-zero on any validation failure.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  countrySchema,
  citySchema,
  quarterSchema,
  legalSchema,
  glossarySchema,
  datasetSchema
} from '../lib/content/schemas';

const ROOT = path.join(process.cwd(), 'content');

const dirs: { sub: string; schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } } }[] = [
  { sub: 'countries', schema: countrySchema },
  { sub: 'cities', schema: citySchema },
  { sub: 'quarters', schema: quarterSchema },
  { sub: 'legal', schema: legalSchema },
  { sub: 'glossary', schema: glossarySchema },
  { sub: 'datasets', schema: datasetSchema }
];

let failed = 0;

for (const { sub, schema } of dirs) {
  const dir = path.join(ROOT, sub);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(raw);
    const r = schema.safeParse(data);
    if (!r.success) {
      failed++;
      console.error(`[validate] ${sub}/${file}\n${JSON.stringify(r.error, null, 2)}`);
    }
  }
}

if (failed > 0) {
  console.error(`\n[validate] ${failed} content file(s) failed validation.`);
  process.exit(1);
}
console.log('[validate] all content valid.');
