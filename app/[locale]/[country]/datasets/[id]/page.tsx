import { notFound } from 'next/navigation';
import { findCountryBySlug, findDataset, getCountries, getDatasets } from '@/lib/content/loader';
import { loadProcessed } from '@/lib/data/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { DataTable } from '@/components/ui/DataTable';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { CitationBlock } from '@/components/ui/CitationBlock';
import { formatDate } from '@/lib/format';
import path from 'node:path';

type Params = { locale: string; country: string; id: string };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const dataset of getDatasets()) {
    for (const iso of dataset.frontmatter.country_scope) {
      const country = getCountries().find((c) => c.frontmatter.iso === iso);
      if (!country) continue;
      for (const locale of locales) {
        out.push({
          locale,
          country: localizedSlug(country.frontmatter, locale),
          id: dataset.frontmatter.id
        });
      }
    }
  }
  return out;
}

type SeriesRow = { period: string; value: number; segment?: string };

export default async function DatasetPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();
  const dataset = findDataset(params.id);
  if (!dataset) notFound();

  const fm = dataset.frontmatter;
  const title = locale === 'fr' ? fm.title_fr : fm.title_en;
  const publisher = locale === 'fr' ? fm.publisher_fr : fm.publisher_en;

  let processed: ReturnType<typeof loadProcessed<SeriesRow>> = null;
  if (fm.processed_path) {
    const filename = path.basename(fm.processed_path);
    processed = loadProcessed<SeriesRow>(filename);
  }

  const rows = processed?.rows ?? [];
  const seriesData = rows
    .filter((r) => typeof r.period === 'string' && typeof r.value === 'number')
    .map((r) => ({ period: r.period, value: r.value }));

  const manifestStatus = processed?.manifest.status ?? 'pending';

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: 'Datasets', href: `/${locale}/${params.country}/datasets` },
            { label: title }
          ]}
        />
      </div>
      <EntityHeader
        kicker={`${localizedName(country.frontmatter, locale)} · Dataset`}
        title={title}
        subtitle={publisher}
        lastUpdated={fm.last_fetched ? formatDate(fm.last_fetched, locale) : undefined}
        locale={locale}
        status={fm.status}
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ChartCard
            title={locale === 'fr' ? 'Série temporelle' : 'Time series'}
            subtitle={`${fm.first_period ?? ''} → ${fm.latest_period ?? ''}`}
            source={{
              publisher,
              url: fm.license_url,
              fetched: fm.last_fetched,
              license: fm.license
            }}
            chart={<TimeSeriesChart data={seriesData} />}
            table={
              seriesData.length > 0 ? (
                <DataTable
                  headers={[
                    { label: locale === 'fr' ? 'Période' : 'Period' },
                    { label: locale === 'fr' ? 'Valeur' : 'Value', align: 'right' }
                  ]}
                  rows={seriesData.map((r) => [
                    { value: r.period, mono: true },
                    { value: r.value.toLocaleString(), align: 'right' }
                  ])}
                />
              ) : undefined
            }
            hasData={seriesData.length > 0}
          />
        </div>

        <aside className="flex flex-col gap-6">
          <section className="panel p-5">
            <h3 className="label-tiny mb-3">{locale === 'fr' ? 'Métadonnées' : 'Metadata'}</h3>
            <dl className="flex flex-col gap-3 text-sm">
              <Row label="ID" value={fm.id} mono />
              <Row label={locale === 'fr' ? 'Fréquence' : 'Update frequency'} value={fm.update_frequency} />
              <Row label={locale === 'fr' ? 'Méthode de collecte' : 'Fetch method'} value={fm.fetch_method} />
              <Row label={locale === 'fr' ? 'Licence' : 'License'} value={fm.license} />
              <Row label={locale === 'fr' ? 'Statut pipeline' : 'Pipeline status'} value={manifestStatus} />
              {fm.first_period ? (
                <Row label={locale === 'fr' ? 'Première période' : 'First period'} value={fm.first_period} mono />
              ) : null}
              {fm.latest_period ? (
                <Row label={locale === 'fr' ? 'Dernière période' : 'Latest period'} value={fm.latest_period} mono />
              ) : null}
            </dl>
          </section>

          {fm.fields && fm.fields.length > 0 ? (
            <section className="panel p-5">
              <h3 className="label-tiny mb-3">{locale === 'fr' ? 'Champs' : 'Fields'}</h3>
              <ul className="flex flex-col gap-1 text-xs mono">
                {fm.fields.map((f) => (
                  <li key={f.name} className="flex items-baseline justify-between gap-3">
                    <span>{f.name}</span>
                    <span className="text-ink-tertiary">{f.type}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </section>

      <section className="mt-10">
        <CitationBlock
          locale={locale}
          pathname={`/${locale}/${params.country}/datasets/${fm.id}`}
          input={{
            title,
            publisher,
            accessedDate: fm.last_fetched
          }}
        />
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-ink-tertiary">{label}</dt>
      <dd className={mono ? 'mono text-xs' : 'text-sm'}>{value}</dd>
    </div>
  );
}
