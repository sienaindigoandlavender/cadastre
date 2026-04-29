import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  findCity,
  findCountryBySlug,
  getCities,
  getCountries,
  quartersForCity
} from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';

type Params = { locale: string; country: string; city: string };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const city of getCities()) {
    const country = getCountries().find((c) => c.frontmatter.iso === city.frontmatter.country);
    if (!country) continue;
    for (const locale of locales) {
      out.push({
        locale,
        country: localizedSlug(country.frontmatter, locale),
        city: localizedSlug(city.frontmatter, locale)
      });
    }
  }
  return out;
}

export default async function QuartersIndex({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();
  const city = findCity(country.frontmatter.iso, params.city);
  if (!city) notFound();
  const quarters = quartersForCity(country.frontmatter.iso, city.frontmatter.slug_en);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: localizedName(city.frontmatter, locale), href: `/${locale}/${params.country}/${params.city}` },
            { label: locale === 'fr' ? 'Quartiers' : 'Quarters' }
          ]}
        />
      </div>
      <EntityHeader
        kicker={localizedName(city.frontmatter, locale)}
        title={locale === 'fr' ? 'Quartiers' : 'Quarters'}
        locale={locale}
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
        {quarters
          .sort((a, b) =>
            localizedName(a.frontmatter, locale).localeCompare(localizedName(b.frontmatter, locale))
          )
          .map((q) => (
            <li key={q.frontmatter.slug_en} className="bg-white">
              <Link
                href={`/${locale}/${params.country}/${params.city}/${localizedSlug(q.frontmatter, locale)}`}
                className="flex items-baseline justify-between p-5 gap-4 hover:bg-surface"
              >
                <span className="text-base font-medium">{localizedName(q.frontmatter, locale)}</span>
                <span className="text-xs text-ink-tertiary">{q.frontmatter.character}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
