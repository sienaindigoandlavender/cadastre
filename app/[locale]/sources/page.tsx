import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';
import { getDatasets, getCountries } from '@/lib/content/loader';
import { localizedSlug } from '@/lib/i18n/slugs';

type Params = { locale: string };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SourcesPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const datasets = getDatasets();
  const countries = getCountries();

  const grouped = datasets.reduce<Record<string, typeof datasets>>((acc, d) => {
    for (const iso of d.frontmatter.country_scope) {
      (acc[iso] ||= []).push(d);
    }
    return acc;
  }, {});

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb locale={locale} items={[{ label: locale === 'fr' ? 'Sources' : 'Sources' }]} />
      </div>
      <EntityHeader
        kicker="Cadastre"
        title={locale === 'fr' ? 'Sources' : 'Sources'}
        subtitle={
          locale === 'fr'
            ? `${datasets.length} jeux de données catalogués`
            : `${datasets.length} datasets catalogued`
        }
        locale={locale}
      />
      <div className="flex flex-col gap-10">
        {Object.entries(grouped).map(([iso, list]) => {
          const country = countries.find((c) => c.frontmatter.iso === iso);
          if (!country) return null;
          return (
            <section key={iso}>
              <h2 className="label-tiny mb-3">
                {locale === 'fr' ? country.frontmatter.name_fr : country.frontmatter.name_en} · {iso}
              </h2>
              <ul className="border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
                {list.map((d) => (
                  <li key={d.frontmatter.id} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/${locale}/${localizedSlug(country.frontmatter, locale)}/datasets/${d.frontmatter.id}`}
                        className="text-base font-medium hover:underline"
                      >
                        {locale === 'fr' ? d.frontmatter.title_fr : d.frontmatter.title_en}
                      </Link>
                      <p className="text-xs text-ink-tertiary mono mt-1">
                        {locale === 'fr' ? d.frontmatter.publisher_fr : d.frontmatter.publisher_en} ·{' '}
                        {d.frontmatter.license} · {d.frontmatter.update_frequency}
                      </p>
                    </div>
                    {d.frontmatter.license_url ? (
                      <a
                        href={d.frontmatter.license_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline shrink-0 text-ink-secondary"
                      >
                        {locale === 'fr' ? 'Source' : 'Source'} ↗
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
