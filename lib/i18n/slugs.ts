import type { Locale } from './config';
import {
  getCountries,
  getCities,
  getQuarters,
  getLegal,
  getGlossary
} from '@/lib/content/loader';

export function localizedSlug(
  fm: { slug_en: string; slug_fr: string },
  locale: Locale
): string {
  return locale === 'fr' ? fm.slug_fr : fm.slug_en;
}

export function localizedName(
  fm: { name_en: string; name_fr: string },
  locale: Locale
): string {
  return locale === 'fr' ? fm.name_fr : fm.name_en;
}

export function countryHref(iso: string, locale: Locale, ...rest: string[]): string {
  const country = getCountries().find((c) => c.frontmatter.iso === iso);
  if (!country) return `/${locale}`;
  const slug = localizedSlug(country.frontmatter, locale);
  return ['', locale, slug, ...rest.filter(Boolean)].join('/');
}

export function cityHref(iso: string, citySlug: string, locale: Locale, ...rest: string[]): string {
  const city = getCities().find(
    (c) =>
      c.frontmatter.iso === iso &&
      (c.frontmatter.slug_en === citySlug || c.frontmatter.slug_fr === citySlug)
  );
  const country = getCountries().find((c) => c.frontmatter.iso === iso);
  if (!city || !country) return `/${locale}`;
  return [
    '',
    locale,
    localizedSlug(country.frontmatter, locale),
    localizedSlug(city.frontmatter, locale),
    ...rest.filter(Boolean)
  ].join('/');
}

export function quarterHref(
  iso: string,
  citySlug: string,
  quarterSlug: string,
  locale: Locale
): string {
  const country = getCountries().find((c) => c.frontmatter.iso === iso);
  const city = getCities().find(
    (c) =>
      c.frontmatter.iso === iso &&
      (c.frontmatter.slug_en === citySlug || c.frontmatter.slug_fr === citySlug)
  );
  const quarter = getQuarters().find(
    (q) =>
      q.frontmatter.iso === iso &&
      (q.frontmatter.slug_en === quarterSlug || q.frontmatter.slug_fr === quarterSlug)
  );
  if (!country || !city || !quarter) return `/${locale}`;
  return [
    '',
    locale,
    localizedSlug(country.frontmatter, locale),
    localizedSlug(city.frontmatter, locale),
    localizedSlug(quarter.frontmatter, locale)
  ].join('/');
}

export function legalHref(iso: string, topicSlug: string, locale: Locale): string {
  const country = getCountries().find((c) => c.frontmatter.iso === iso);
  const legal = getLegal().find(
    (l) =>
      l.frontmatter.iso === iso &&
      (l.frontmatter.slug_en === topicSlug || l.frontmatter.slug_fr === topicSlug)
  );
  if (!country || !legal) return `/${locale}`;
  return [
    '',
    locale,
    localizedSlug(country.frontmatter, locale),
    'legal',
    localizedSlug(legal.frontmatter, locale)
  ].join('/');
}

export function datasetHref(iso: string, datasetId: string, locale: Locale): string {
  const country = getCountries().find((c) => c.frontmatter.iso === iso);
  if (!country) return `/${locale}`;
  return ['', locale, localizedSlug(country.frontmatter, locale), 'datasets', datasetId].join('/');
}

export function glossaryHref(slugAny: string, locale: Locale): string {
  const term = getGlossary().find(
    (g) => g.frontmatter.slug_en === slugAny || g.frontmatter.slug_fr === slugAny
  );
  if (!term) return `/${locale}/glossary`;
  return ['', locale, 'glossary', localizedSlug(term.frontmatter, locale)].join('/');
}
