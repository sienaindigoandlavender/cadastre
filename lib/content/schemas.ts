import { z } from 'zod';

const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (typeof v === 'string' ? v : v.toISOString().slice(0, 10)))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD'));

const status = z.enum(['live', 'draft', 'stub']);

export const countrySchema = z.object({
  type: z.literal('country'),
  iso: z.string().length(2),
  slug_en: z.string(),
  slug_fr: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  official_name_en: z.string(),
  official_name_fr: z.string(),
  capital: z.string(),
  currency: z.string(),
  official_languages: z.array(z.string()),
  working_languages: z.array(z.string()),
  population_latest: z.number().optional(),
  population_year: z.number().optional(),
  gdp_usd_latest: z.number().optional(),
  gdp_year: z.number().optional(),
  title_systems: z.array(z.string()),
  governing_authority_en: z.string(),
  governing_authority_fr: z.string(),
  key_legislation: z.array(z.string()),
  data_availability: z.enum(['high', 'medium', 'low', 'none']),
  status,
  last_updated: isoDate,
  sources: z.array(z.string()).optional()
});

export const citySchema = z.object({
  type: z.literal('city'),
  iso: z.string().length(2),
  country: z.string().length(2),
  slug_en: z.string(),
  slug_fr: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  admin_1: z.string().optional(),
  population_latest: z.number().optional(),
  population_year: z.number().optional(),
  coordinates: z.tuple([z.number(), z.number()]),
  mapbox_zoom_default: z.number().min(1).max(22).default(11),
  property_market_tier: z.enum(['established', 'emerging', 'frontier']),
  status,
  last_updated: isoDate,
  sources: z.array(z.string()).optional()
});

export const quarterSchema = z.object({
  type: z.literal('quarter'),
  iso: z.string().length(2),
  country: z.string().length(2),
  city: z.string(),
  slug_en: z.string(),
  slug_fr: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  geojson: z.string().optional(),
  character: z.enum(['medina', 'colonial', 'modern', 'periurban', 'industrial', 'mixed']),
  title_distribution: z.record(z.string(), z.number()).optional(),
  status,
  last_updated: isoDate,
  sources: z.array(z.string()).optional()
});

export const legalSchema = z.object({
  type: z.literal('legal'),
  iso: z.string().length(2),
  country: z.string().length(2),
  slug_en: z.string(),
  slug_fr: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  category: z.enum([
    'title_system',
    'transaction',
    'fee',
    'authority',
    'instrument',
    'tax',
    'procedure'
  ]),
  governing_law: z.string().optional(),
  related_concepts: z.array(z.string()).optional(),
  parallel_systems_other_countries: z
    .array(
      z.object({
        country: z.string().length(2),
        concept: z.string()
      })
    )
    .optional(),
  official_french_term: z.string().optional(),
  plain_english_term: z.string().optional(),
  status,
  last_updated: isoDate,
  sources: z.array(z.string()).optional()
});

export const glossarySchema = z.object({
  type: z.literal('glossary'),
  slug_en: z.string(),
  slug_fr: z.string(),
  term_en: z.string(),
  term_fr: z.string(),
  category: z.string(),
  country_variants: z
    .array(
      z.object({
        iso: z.string().length(2),
        term: z.string(),
        link: z.string()
      })
    )
    .optional(),
  related_terms: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  last_verified: isoDate
});

export const datasetSchema = z.object({
  type: z.literal('dataset'),
  id: z.string(),
  title_en: z.string(),
  title_fr: z.string(),
  country_scope: z.array(z.string().length(2)),
  publisher_en: z.string(),
  publisher_fr: z.string(),
  license: z.enum(['public', 'cc-by', 'cc-by-sa', 'restricted', 'proprietary']),
  license_url: z.string().url().optional(),
  update_frequency: z.enum([
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'biannual',
    'annual',
    'irregular'
  ]),
  first_period: z.string().optional(),
  latest_period: z.string().optional(),
  fetch_method: z.enum(['manual', 'scrape', 'api', 'bulk']),
  fetch_path: z.string().optional(),
  processed_path: z.string().optional(),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        format: z.string().optional(),
        values: z.array(z.string()).optional()
      })
    )
    .optional(),
  last_fetched: isoDate.optional(),
  status
});

export type CountryFrontmatter = z.infer<typeof countrySchema>;
export type CityFrontmatter = z.infer<typeof citySchema>;
export type QuarterFrontmatter = z.infer<typeof quarterSchema>;
export type LegalFrontmatter = z.infer<typeof legalSchema>;
export type GlossaryFrontmatter = z.infer<typeof glossarySchema>;
export type DatasetFrontmatter = z.infer<typeof datasetSchema>;
