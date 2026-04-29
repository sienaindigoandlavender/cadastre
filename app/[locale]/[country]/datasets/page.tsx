import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { datasetsForCountry, findCountryBySlug, getCountries } from '@/lib/content/loader';
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

export default async function DatasetsIndex({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();
  const items = datasetsForCountry(country.frontmatter.iso);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: 'Datasets' }
          ]}
        />
      </div>
      <EntityHeader
        kicker={localizedName(country.frontmatter, locale)}
        title="Datasets"
        subtitle={
          locale === 'fr'
            ? `${items.length} jeux de données catalogués`
            : `${items.length} datasets catalogued`
        }
        locale={locale}
      />
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
        {items.map((d) => (
          <li key={d.frontmatter.id} className="bg-white">
            <Link href={`/${locale}/${params.country}/datasets/${d.frontmatter.id}`} className="block p-5 hover:bg-surface">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-medium">
                    {locale === 'fr' ? d.frontmatter.title_fr : d.frontmatter.title_en}
                  </p>
                  <p className="text-xs text-ink-tertiary mt-1">
                    {locale === 'fr' ? d.frontmatter.publisher_fr : d.frontmatter.publisher_en}
                  </p>
                </div>
                <span className="label-tiny">{d.frontmatter.update_frequency}</span>
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-ink-tertiary mono">
                <span>{d.frontmatter.id}</span>
                {d.frontmatter.latest_period ? <span>· {d.frontmatter.latest_period}</span> : null}
                <span>· {d.frontmatter.license}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
