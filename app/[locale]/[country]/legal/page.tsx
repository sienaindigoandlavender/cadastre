import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { findCountryBySlug, getCountries, legalForCountry } from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';

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

export default async function LegalIndex({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();
  const items = legalForCountry(country.frontmatter.iso).sort((a, b) =>
    localizedName(a.frontmatter, locale).localeCompare(localizedName(b.frontmatter, locale))
  );

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.frontmatter.category] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: locale === 'fr' ? 'Notions juridiques' : 'Legal concepts' }
          ]}
        />
      </div>
      <EntityHeader
        kicker={localizedName(country.frontmatter, locale)}
        title={locale === 'fr' ? 'Notions juridiques' : 'Legal concepts'}
        subtitle={
          locale === 'fr'
            ? `${items.length} notions documentées`
            : `${items.length} concepts documented`
        }
        locale={locale}
        alternates={{
          en: `/en/${country.frontmatter.slug_en}/legal`,
          fr: `/fr/${country.frontmatter.slug_fr}/legal`
        }}
      />
      <div className="flex flex-col gap-12">
        {Object.entries(grouped).map(([cat, list]) => (
          <section key={cat}>
            <h2 className="label-tiny mb-3 capitalize">{cat.replace(/_/g, ' ')}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
              {list.map((l) => (
                <li key={l.frontmatter.slug_en} className="bg-white">
                  <Link
                    href={`/${locale}/${params.country}/legal/${localizedSlug(l.frontmatter, locale)}`}
                    className="block p-5 hover:bg-surface"
                  >
                    <span className="text-base font-medium editorial">
                      {localizedName(l.frontmatter, locale)}
                    </span>
                    {l.frontmatter.governing_law ? (
                      <p className="text-xs text-ink-tertiary mono mt-1">
                        {l.frontmatter.governing_law}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
