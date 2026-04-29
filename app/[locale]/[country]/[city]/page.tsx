import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  findCity,
  findCountryBySlug,
  getCountries,
  getCities,
  quartersForCity
} from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';
import { KpiStrip } from '@/components/ui/KpiStrip';
import { ChartCard } from '@/components/ui/ChartCard';
import { MapPanel } from '@/components/maps/MapPanel';
import { CitationBlock } from '@/components/ui/CitationBlock';
import { formatCompactNumber, formatDate } from '@/lib/format';

type Params = { locale: string; country: string; city: string };

export function generateStaticParams() {
  const out: Params[] = [];
  const countries = getCountries();
  const cities = getCities();
  for (const city of cities) {
    const country = countries.find((c) => c.frontmatter.iso === city.frontmatter.country);
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

export default async function CityPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();
  const city = findCity(country.frontmatter.iso, params.city);
  if (!city) notFound();

  const fm = city.frontmatter;
  const t = await getTranslations({ locale, namespace: 'kpi' });
  const tp = await getTranslations({ locale, namespace: 'panel' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const quarters = quartersForCity(fm.iso, fm.slug_en);

  const kpis = [
    {
      label: t('population'),
      value: fm.population_latest ? formatCompactNumber(fm.population_latest, locale) : '—',
      meta: fm.population_year ? String(fm.population_year) : undefined
    },
    {
      label: locale === 'fr' ? 'Quartiers' : 'Quarters',
      value: String(quarters.length)
    },
    {
      label: locale === 'fr' ? 'Niveau de marché' : 'Market tier',
      value:
        fm.property_market_tier === 'established'
          ? locale === 'fr'
            ? 'Établi'
            : 'Established'
          : fm.property_market_tier === 'emerging'
          ? locale === 'fr'
            ? 'Émergent'
            : 'Emerging'
          : locale === 'fr'
          ? 'Frontière'
          : 'Frontier'
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: localizedName(fm, locale) }
          ]}
        />
      </div>
      <EntityHeader
        kicker={localizedName(country.frontmatter, locale)}
        title={localizedName(fm, locale)}
        lastUpdated={formatDate(fm.last_updated, locale)}
        locale={locale}
        alternates={{
          en: `/en/${country.frontmatter.slug_en}/${fm.slug_en}`,
          fr: `/fr/${country.frontmatter.slug_fr}/${fm.slug_fr}`
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
                zoom={fm.mapbox_zoom_default}
                fallbackNote={tc('noData')}
                height={420}
              />
            }
            hasData
          />
        </div>
        <div>
          <section className="panel p-5">
            <h3 className="label-tiny mb-3">{locale === 'fr' ? 'Quartiers' : 'Quarters'}</h3>
            {quarters.length === 0 ? (
              <p className="text-sm text-ink-tertiary">{tc('noData')}</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {quarters
                  .sort((a, b) =>
                    localizedName(a.frontmatter, locale).localeCompare(
                      localizedName(b.frontmatter, locale)
                    )
                  )
                  .map((q) => (
                    <li key={q.frontmatter.slug_en} className="text-sm">
                      <Link
                        href={`/${locale}/${params.country}/${params.city}/${localizedSlug(q.frontmatter, locale)}`}
                        className="flex items-baseline justify-between gap-3 text-ink-secondary hover:text-ink-primary"
                      >
                        <span>{localizedName(q.frontmatter, locale)}</span>
                        <span className="text-xs text-ink-tertiary">{q.frontmatter.character}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>
      </section>

      <section className="mt-10">
        <CitationBlock
          locale={locale}
          pathname={`/${locale}/${params.country}/${params.city}`}
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
