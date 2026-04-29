import type { MetadataRoute } from 'next';
import {
  getCountries,
  getCities,
  getQuarters,
  getLegal,
  getDatasets,
  getGlossary
} from '@/lib/content/loader';
import { locales } from '@/lib/i18n/config';
import { localizedSlug } from '@/lib/i18n/slugs';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cadastre.dancingwithlions.com';

function safe(path: string): string {
  if (!path) return BASE;
  const cleaned = path.replace(/[^\w\-/.~%]/g, encodeURIComponent);
  return `${BASE}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  for (const locale of locales) {
    out.push({ url: safe(`/${locale}`), lastModified, priority: 1 });
    out.push({ url: safe(`/${locale}/glossary`), lastModified });
    out.push({ url: safe(`/${locale}/methodology`), lastModified });
    out.push({ url: safe(`/${locale}/sources`), lastModified });
    out.push({ url: safe(`/${locale}/about`), lastModified });
  }

  for (const country of getCountries()) {
    for (const locale of locales) {
      const cSlug = localizedSlug(country.frontmatter, locale);
      out.push({ url: safe(`/${locale}/${cSlug}`), lastModified, priority: 0.8 });
      out.push({ url: safe(`/${locale}/${cSlug}/cities`), lastModified });
      out.push({ url: safe(`/${locale}/${cSlug}/legal`), lastModified });
      out.push({ url: safe(`/${locale}/${cSlug}/datasets`), lastModified });
    }
  }

  for (const city of getCities()) {
    const country = getCountries().find((c) => c.frontmatter.iso === city.frontmatter.country);
    if (!country) continue;
    for (const locale of locales) {
      out.push({
        url: safe(
          `/${locale}/${localizedSlug(country.frontmatter, locale)}/${localizedSlug(city.frontmatter, locale)}`
        ),
        lastModified
      });
    }
  }

  for (const quarter of getQuarters()) {
    const country = getCountries().find((c) => c.frontmatter.iso === quarter.frontmatter.iso);
    const city = getCities().find(
      (c) =>
        c.frontmatter.iso === quarter.frontmatter.iso &&
        c.frontmatter.slug_en === quarter.frontmatter.city
    );
    if (!country || !city) continue;
    for (const locale of locales) {
      out.push({
        url: safe(
          `/${locale}/${localizedSlug(country.frontmatter, locale)}/${localizedSlug(
            city.frontmatter,
            locale
          )}/${localizedSlug(quarter.frontmatter, locale)}`
        ),
        lastModified
      });
    }
  }

  for (const legal of getLegal()) {
    const country = getCountries().find((c) => c.frontmatter.iso === legal.frontmatter.iso);
    if (!country) continue;
    for (const locale of locales) {
      out.push({
        url: safe(
          `/${locale}/${localizedSlug(country.frontmatter, locale)}/legal/${localizedSlug(
            legal.frontmatter,
            locale
          )}`
        ),
        lastModified
      });
    }
  }

  for (const dataset of getDatasets()) {
    for (const iso of dataset.frontmatter.country_scope) {
      const country = getCountries().find((c) => c.frontmatter.iso === iso);
      if (!country) continue;
      for (const locale of locales) {
        out.push({
          url: safe(
            `/${locale}/${localizedSlug(country.frontmatter, locale)}/datasets/${dataset.frontmatter.id}`
          ),
          lastModified
        });
      }
    }
  }

  for (const term of getGlossary()) {
    for (const locale of locales) {
      out.push({
        url: safe(`/${locale}/glossary/${localizedSlug(term.frontmatter, locale)}`),
        lastModified
      });
    }
  }

  return out;
}
