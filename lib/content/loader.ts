import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  countrySchema,
  citySchema,
  quarterSchema,
  legalSchema,
  glossarySchema,
  datasetSchema,
  type CountryFrontmatter,
  type CityFrontmatter,
  type QuarterFrontmatter,
  type LegalFrontmatter,
  type GlossaryFrontmatter,
  type DatasetFrontmatter
} from './schemas';
import type { Locale } from '@/lib/i18n/config';

const ROOT = path.join(process.cwd(), 'content');

type Body = { en: string; fr: string };

function splitLocaleBody(raw: string): Body {
  const en: string[] = [];
  const fr: string[] = [];
  let bucket: 'none' | 'en' | 'fr' = 'none';
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^##\s+(?:Description|Definition|Sommaire|Texte|Notes)\s*\((en|fr)\)\s*$/i);
    if (m) {
      bucket = m[1].toLowerCase() === 'fr' ? 'fr' : 'en';
      continue;
    }
    if (bucket === 'en') en.push(line);
    else if (bucket === 'fr') fr.push(line);
  }
  return { en: en.join('\n').trim(), fr: fr.join('\n').trim() };
}

function readMdxDir<T>(
  subdir: string,
  parse: (data: unknown, file: string) => T
): { frontmatter: T; body: Body; sourcePath: string }[] {
  const dir = path.join(ROOT, subdir);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const parsed = matter(raw);
    const fm = parse(parsed.data, file);
    return {
      frontmatter: fm,
      body: splitLocaleBody(parsed.content),
      sourcePath: path.posix.join('content', subdir, file)
    };
  });
}

export type CountryRecord = {
  frontmatter: CountryFrontmatter;
  body: Body;
  sourcePath: string;
};
export type CityRecord = { frontmatter: CityFrontmatter; body: Body; sourcePath: string };
export type QuarterRecord = { frontmatter: QuarterFrontmatter; body: Body; sourcePath: string };
export type LegalRecord = { frontmatter: LegalFrontmatter; body: Body; sourcePath: string };
export type GlossaryRecord = { frontmatter: GlossaryFrontmatter; body: Body; sourcePath: string };
export type DatasetRecord = { frontmatter: DatasetFrontmatter; body: Body; sourcePath: string };

let cache: {
  countries?: CountryRecord[];
  cities?: CityRecord[];
  quarters?: QuarterRecord[];
  legal?: LegalRecord[];
  glossary?: GlossaryRecord[];
  datasets?: DatasetRecord[];
} = {};

function fail(file: string, error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`[content] failed to parse ${file}: ${message}`);
}

export function getCountries(): CountryRecord[] {
  if (!cache.countries) {
    cache.countries = readMdxDir('countries', (data, file) => {
      const r = countrySchema.safeParse(data);
      if (!r.success) fail(file, r.error);
      return r.data;
    });
  }
  return cache.countries;
}

export function getCities(): CityRecord[] {
  if (!cache.cities) {
    cache.cities = readMdxDir('cities', (data, file) => {
      const r = citySchema.safeParse(data);
      if (!r.success) fail(file, r.error);
      return r.data;
    });
  }
  return cache.cities;
}

export function getQuarters(): QuarterRecord[] {
  if (!cache.quarters) {
    cache.quarters = readMdxDir('quarters', (data, file) => {
      const r = quarterSchema.safeParse(data);
      if (!r.success) fail(file, r.error);
      return r.data;
    });
  }
  return cache.quarters;
}

export function getLegal(): LegalRecord[] {
  if (!cache.legal) {
    cache.legal = readMdxDir('legal', (data, file) => {
      const r = legalSchema.safeParse(data);
      if (!r.success) fail(file, r.error);
      return r.data;
    });
  }
  return cache.legal;
}

export function getGlossary(): GlossaryRecord[] {
  if (!cache.glossary) {
    cache.glossary = readMdxDir('glossary', (data, file) => {
      const r = glossarySchema.safeParse(data);
      if (!r.success) fail(file, r.error);
      return r.data;
    });
  }
  return cache.glossary;
}

export function getDatasets(): DatasetRecord[] {
  if (!cache.datasets) {
    cache.datasets = readMdxDir('datasets', (data, file) => {
      const r = datasetSchema.safeParse(data);
      if (!r.success) fail(file, r.error);
      return r.data;
    });
  }
  return cache.datasets;
}

export function findCountry(iso: string): CountryRecord | undefined {
  return getCountries().find((c) => c.frontmatter.iso === iso.toUpperCase());
}

export function findCountryBySlug(locale: Locale, slug: string): CountryRecord | undefined {
  return getCountries().find((c) =>
    locale === 'fr' ? c.frontmatter.slug_fr === slug : c.frontmatter.slug_en === slug
  );
}

export function findCity(iso: string, citySlugAny: string): CityRecord | undefined {
  return getCities().find(
    (c) =>
      c.frontmatter.iso === iso.toUpperCase() &&
      (c.frontmatter.slug_en === citySlugAny || c.frontmatter.slug_fr === citySlugAny)
  );
}

export function findQuarter(
  iso: string,
  citySlugAny: string,
  quarterSlugAny: string
): QuarterRecord | undefined {
  return getQuarters().find(
    (q) =>
      q.frontmatter.iso === iso.toUpperCase() &&
      (q.frontmatter.city === citySlugAny ||
        q.frontmatter.city ===
          findCity(iso, citySlugAny)?.frontmatter.slug_en) &&
      (q.frontmatter.slug_en === quarterSlugAny || q.frontmatter.slug_fr === quarterSlugAny)
  );
}

export function findLegal(iso: string, slugAny: string): LegalRecord | undefined {
  return getLegal().find(
    (l) =>
      l.frontmatter.iso === iso.toUpperCase() &&
      (l.frontmatter.slug_en === slugAny || l.frontmatter.slug_fr === slugAny)
  );
}

export function findGlossaryTerm(slugAny: string): GlossaryRecord | undefined {
  return getGlossary().find(
    (g) => g.frontmatter.slug_en === slugAny || g.frontmatter.slug_fr === slugAny
  );
}

export function findDataset(id: string): DatasetRecord | undefined {
  return getDatasets().find((d) => d.frontmatter.id === id);
}

export function citiesForCountry(iso: string): CityRecord[] {
  return getCities().filter((c) => c.frontmatter.country === iso.toUpperCase());
}

export function quartersForCity(iso: string, citySlug: string): QuarterRecord[] {
  return getQuarters().filter(
    (q) => q.frontmatter.iso === iso.toUpperCase() && q.frontmatter.city === citySlug
  );
}

export function legalForCountry(iso: string): LegalRecord[] {
  return getLegal().filter((l) => l.frontmatter.iso === iso.toUpperCase());
}

export function datasetsForCountry(iso: string): DatasetRecord[] {
  return getDatasets().filter((d) => d.frontmatter.country_scope.includes(iso.toUpperCase()));
}
