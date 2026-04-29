import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  findCity,
  findCountryBySlug,
  findQuarter,
  getCities,
  getCountries,
  getQuarters
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
import { DistributionChart } from '@/components/charts/DistributionChart';
import { CitationBlock } from '@/components/ui/CitationBlock';
import { formatDate, formatPercent } from '@/lib/format';
import fs from 'node:fs';
import path from 'node:path';

type Params = { locale: string; country: string; city: string; quarter: string };

export function generateStaticParams() {
  const out: Params[] = [];
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
        locale,
        country: localizedSlug(country.frontmatter, locale),
        city: localizedSlug(city.frontmatter, locale),
        quarter: localizedSlug(quarter.frontmatter, locale)
      });
    }
  }
  return out;
}

function loadGeoJSON(relativePath?: string): GeoJSON.FeatureCollection | null {
  if (!relativePath) return null;
  try {
    const file = path.join(process.cwd(), 'public', 'geo', relativePath);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function QuarterPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();
  const city = findCity(country.frontmatter.iso, params.city);
  if (!city) notFound();
  const quarter = findQuarter(country.frontmatter.iso, params.city, params.quarter);
  if (!quarter) notFound();

  const fm = quarter.frontmatter;
  const tp = await getTranslations({ locale, namespace: 'panel' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const geo = loadGeoJSON(fm.geojson);

  const titleDistro = fm.title_distribution
    ? Object.entries(fm.title_distribution).map(([k, v]) => ({
        label: k.replace(/_/g, ' '),
        value: v
      }))
    : [];

  const character = fm.character;
  const characterLabel: Record<string, { en: string; fr: string }> = {
    medina: { en: 'Medina', fr: 'Médina' },
    colonial: { en: 'Colonial', fr: 'Colonial' },
    modern: { en: 'Modern', fr: 'Moderne' },
    periurban: { en: 'Peri-urban', fr: 'Périurbain' },
    industrial: { en: 'Industrial', fr: 'Industriel' },
    mixed: { en: 'Mixed', fr: 'Mixte' }
  };

  const kpis = [
    { label: locale === 'fr' ? 'Caractère' : 'Character', value: characterLabel[character][locale] },
    {
      label: locale === 'fr' ? 'Coordonnées' : 'Coordinates',
      value: `${fm.coordinates[0].toFixed(3)}, ${fm.coordinates[1].toFixed(3)}`
    }
  ];

  if (fm.title_distribution) {
    const dominant = Object.entries(fm.title_distribution).sort((a, b) => b[1] - a[1])[0];
    if (dominant) {
      kpis.push({
        label: locale === 'fr' ? 'Régime dominant' : 'Dominant tenure',
        value: `${dominant[0].replace(/_/g, ' ')} (${formatPercent(dominant[1], locale, 0)})`
      });
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: localizedName(city.frontmatter, locale), href: `/${locale}/${params.country}/${params.city}` },
            { label: localizedName(fm, locale) }
          ]}
        />
      </div>
      <EntityHeader
        kicker={`${localizedName(country.frontmatter, locale)} · ${localizedName(city.frontmatter, locale)}`}
        title={localizedName(fm, locale)}
        lastUpdated={formatDate(fm.last_updated, locale)}
        locale={locale}
        alternates={{
          en: `/en/${country.frontmatter.slug_en}/${city.frontmatter.slug_en}/${fm.slug_en}`,
          fr: `/fr/${country.frontmatter.slug_fr}/${city.frontmatter.slug_fr}/${fm.slug_fr}`
        }}
        status={fm.status}
      />
      <KpiStrip metrics={kpis} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2">
          <ChartCard
            title={tp('map')}
            chart={
              <MapPanel
                center={fm.coordinates}
                zoom={15}
                height={420}
                fallbackNote={tc('noData')}
                layers={
                  geo
                    ? [
                        {
                          id: 'quarter',
                          label: localizedName(fm, locale),
                          geojson: geo,
                          color: '#1f4e79'
                        }
                      ]
                    : []
                }
              />
            }
            hasData
          />
        </div>

        <div className="flex flex-col gap-6">
          <ChartCard
            title={locale === 'fr' ? 'Régimes de titre' : 'Tenure mix'}
            subtitle={
              locale === 'fr' ? 'Estimation, registre cadastral' : 'Estimate, cadastral registry'
            }
            chart={<DistributionChart data={titleDistro} />}
            table={
              titleDistro.length > 0 ? (
                <DataTable
                  headers={[
                    { label: locale === 'fr' ? 'Régime' : 'System' },
                    { label: '%', align: 'right' }
                  ]}
                  rows={titleDistro.map((r) => [
                    { value: r.label },
                    { value: formatPercent(r.value, locale, 1), align: 'right' }
                  ])}
                />
              ) : undefined
            }
            hasData={titleDistro.length > 0}
            emptyMessage={tc('noData')}
          />

          <ChartCard
            title={locale === 'fr' ? 'Prix au m² (transactions)' : 'Price per m² (transactions)'}
            subtitle={tc('noData')}
            chart={<div />}
            hasData={false}
            emptyMessage={tc('noData')}
          />
        </div>
      </section>

      <section className="mt-10">
        <CitationBlock
          locale={locale}
          pathname={`/${locale}/${params.country}/${params.city}/${params.quarter}`}
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
