import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { citiesForCountry, findCountryBySlug, getCountries } from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';
import { formatCompactNumber } from '@/lib/format';

type Params = { locale: string; country: string };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const country of getCountries()) {
    for (const locale of locales) {
      out.push({ locale, country: localizedSlug(country.frontmatter, locale) });
    }
  }
  return out;
}

export default async function CitiesIndex({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();

  const cities = citiesForCountry(country.frontmatter.iso).sort((a, b) =>
    localizedName(a.frontmatter, locale).localeCompare(localizedName(b.frontmatter, locale))
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: locale === 'fr' ? 'Villes' : 'Cities' }
          ]}
        />
      </div>
      <EntityHeader
        kicker={localizedName(country.frontmatter, locale)}
        title={locale === 'fr' ? 'Villes' : 'Cities'}
        subtitle={
          locale === 'fr'
            ? `${cities.length} villes documentées`
            : `${cities.length} cities documented`
        }
        locale={locale}
        alternates={{
          en: `/en/${country.frontmatter.slug_en}/cities`,
          fr: `/fr/${country.frontmatter.slug_fr}/cities`
        }}
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
        {cities.map((c) => (
          <li key={c.frontmatter.slug_en} className="bg-white">
            <Link
              href={`/${locale}/${params.country}/${localizedSlug(c.frontmatter, locale)}`}
              className="flex items-baseline justify-between p-5 gap-4 hover:bg-surface"
            >
              <span className="text-base font-medium">{localizedName(c.frontmatter, locale)}</span>
              {c.frontmatter.population_latest ? (
                <span className="text-xs text-ink-tertiary tabular-nums">
                  {formatCompactNumber(c.frontmatter.population_latest, locale)}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
