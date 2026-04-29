import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  citiesForCountry,
  datasetsForCountry,
  findCountryBySlug,
  getCountries,
  legalForCountry
} from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';
import { KpiStrip } from '@/components/ui/KpiStrip';
import { ChartCard } from '@/components/ui/ChartCard';
import { DataTable } from '@/components/ui/DataTable';
import { MapPanel } from '@/components/maps/MapPanel';
import { CitationBlock } from '@/components/ui/CitationBlock';
import { formatCompactNumber, formatDate } from '@/lib/format';

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

export async function generateMetadata({ params }: { params: Params }) {
  if (!isLocale(params.locale)) return {};
  const country = findCountryBySlug(params.locale as Locale, params.country);
  if (!country) return {};
  return {
    title: localizedName(country.frontmatter, params.locale as Locale),
    description: country.frontmatter.official_name_en,
    alternates: {
      canonical: `/${params.locale}/${params.country}`,
      languages: {
        en: `/en/${country.frontmatter.slug_en}`,
        fr: `/fr/${country.frontmatter.slug_fr}`,
        'x-default': `/fr/${country.frontmatter.slug_fr}`
      }
    }
  };
}

export default async function CountryPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();

  const fm = country.frontmatter;
  const t = await getTranslations({ locale, namespace: 'kpi' });
  const tp = await getTranslations({ locale, namespace: 'panel' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const cities = citiesForCountry(fm.iso);
  const legal = legalForCountry(fm.iso);
  const datasets = datasetsForCountry(fm.iso);

  const body = locale === 'fr' ? country.body.fr : country.body.en;
  const officialName = locale === 'fr' ? fm.official_name_fr : fm.official_name_en;
  const governingAuthority = locale === 'fr' ? fm.governing_authority_fr : fm.governing_authority_en;

  const kpis = [
    {
      label: t('capital'),
      value: fm.capital
    },
    {
      label: t('population'),
      value: fm.population_latest ? formatCompactNumber(fm.population_latest, locale) : '—',
      meta: fm.population_year ? String(fm.population_year) : undefined
    },
    {
      label: t('gdp'),
      value: fm.gdp_usd_latest ? formatCompactNumber(fm.gdp_usd_latest, locale) : '—',
      unit: fm.gdp_usd_latest ? 'USD' : undefined,
      meta: fm.gdp_year ? String(fm.gdp_year) : undefined
    },
    {
      label: t('currency'),
      value: fm.currency
    },
    {
      label: t('titleSystems'),
      value: String(fm.title_systems.length)
    }
  ];

  const datasetTabularRows = datasets.map((d) => ({
    id: d.frontmatter.id,
    title: locale === 'fr' ? d.frontmatter.title_fr : d.frontmatter.title_en,
    publisher: locale === 'fr' ? d.frontmatter.publisher_fr : d.frontmatter.publisher_en,
    update: d.frontmatter.update_frequency,
    latest: d.frontmatter.latest_period || '—'
  }));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[{ label: localizedName(fm, locale) }]}
        />
      </div>

      <EntityHeader
        kicker={tn('countries')}
        title={localizedName(fm, locale)}
        subtitle={officialName}
        lastUpdated={formatDate(fm.last_updated, locale)}
        locale={locale}
        alternates={{
          en: `/en/${fm.slug_en}`,
          fr: `/fr/${fm.slug_fr}`
        }}
        status={fm.status}
      />

      <KpiStrip metrics={kpis} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2">
          <ChartCard
            title={tp('map')}
            subtitle={`${cities.length} ${locale === 'fr' ? 'villes documentées' : 'cities documented'}`}
            chart={<MapPanel center={[0, 20]} zoom={4} fallbackNote={tc('noData')} height={360} />}
            table={
              cities.length > 0 ? (
                <DataTable
                  headers={[
                    { label: locale === 'fr' ? 'Ville' : 'City' },
                    { label: t('population'), align: 'right' }
                  ]}
                  rows={cities.map((c) => [
                    {
                      value: (
                        <Link
                          href={`/${locale}/${localizedSlug(fm, locale)}/${localizedSlug(c.frontmatter, locale)}`}
                          className="underline"
                        >
                          {localizedName(c.frontmatter, locale)}
                        </Link>
                      )
                    },
                    {
                      align: 'right',
                      value: c.frontmatter.population_latest
                        ? formatCompactNumber(c.frontmatter.population_latest, locale)
                        : '—'
                    }
                  ])}
                />
              ) : undefined
            }
            hasData
          />
        </div>

        <div className="flex flex-col gap-6">
          <section className="panel p-5">
            <h3 className="label-tiny mb-3">{t('governingBody')}</h3>
            <p className="text-sm text-ink-primary leading-relaxed">{governingAuthority}</p>
            {fm.key_legislation.length > 0 ? (
              <p className="text-xs text-ink-tertiary mono mt-3">
                {fm.key_legislation.join(' · ')}
              </p>
            ) : null}
          </section>

          <section className="panel p-5">
            <h3 className="label-tiny mb-3">{tp('relatedEntities')}</h3>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/${localizedSlug(fm, locale)}/legal`}
                  className="flex items-baseline justify-between gap-3 text-ink-secondary hover:text-ink-primary"
                >
                  <span>{locale === 'fr' ? 'Notions juridiques' : 'Legal concepts'}</span>
                  <span className="text-xs text-ink-tertiary tabular-nums">{legal.length}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/${localizedSlug(fm, locale)}/datasets`}
                  className="flex items-baseline justify-between gap-3 text-ink-secondary hover:text-ink-primary"
                >
                  <span>Datasets</span>
                  <span className="text-xs text-ink-tertiary tabular-nums">{datasets.length}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/${localizedSlug(fm, locale)}/cities`}
                  className="flex items-baseline justify-between gap-3 text-ink-secondary hover:text-ink-primary"
                >
                  <span>{locale === 'fr' ? 'Villes' : 'Cities'}</span>
                  <span className="text-xs text-ink-tertiary tabular-nums">{cities.length}</span>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </section>

      {body ? (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 prose-cadastre">
            <h2 className="label-tiny mb-3">{locale === 'fr' ? 'Aperçu' : 'Overview'}</h2>
            <div className="text-sm text-ink-primary whitespace-pre-line leading-relaxed">{body}</div>
          </div>
        </section>
      ) : null}

      {datasets.length > 0 ? (
        <section className="mt-10">
          <ChartCard
            title="Datasets"
            subtitle={`${datasets.length} ${locale === 'fr' ? 'sources publiées' : 'published sources'}`}
            chart={
              <DataTable
                headers={[
                  { label: locale === 'fr' ? 'Titre' : 'Title' },
                  { label: locale === 'fr' ? 'Éditeur' : 'Publisher' },
                  { label: locale === 'fr' ? 'Fréquence' : 'Frequency' },
                  { label: locale === 'fr' ? 'Dernière période' : 'Latest', align: 'right' }
                ]}
                rows={datasetTabularRows.map((r) => [
                  {
                    value: (
                      <Link
                        href={`/${locale}/${localizedSlug(fm, locale)}/datasets/${r.id}`}
                        className="underline"
                      >
                        {r.title}
                      </Link>
                    )
                  },
                  { value: r.publisher },
                  { value: r.update },
                  { value: r.latest, align: 'right' }
                ])}
              />
            }
            hasData
          />
        </section>
      ) : null}

      <section className="mt-10">
        <CitationBlock
          locale={locale}
          pathname={`/${locale}/${localizedSlug(fm, locale)}`}
          input={{
            title: `${localizedName(fm, locale)} — Cadastre`,
            publisher: 'Cadastre',
            accessedDate: fm.last_updated
          }}
        />
      </section>
    </div>
  );
}
