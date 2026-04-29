import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getCountries, getDatasets, getGlossary, getLegal } from '@/lib/content/loader';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { localizedName } from '@/lib/i18n/slugs';
import { MapPanel } from '@/components/maps/MapPanel';
import { notFound } from 'next/navigation';

export default async function ContinentalDashboard({
  params: { locale }
}: {
  params: { locale: string };
}) {
  if (!isLocale(locale)) notFound();
  unstable_setRequestLocale(locale);
  const typed = locale as Locale;
  const ts = await getTranslations({ locale, namespace: 'site' });
  const tn = await getTranslations({ locale, namespace: 'nav' });

  const countries = getCountries().sort((a, b) =>
    localizedName(a.frontmatter, typed).localeCompare(localizedName(b.frontmatter, typed))
  );
  const live = countries.filter((c) => c.frontmatter.status === 'live').length;
  const datasetCount = getDatasets().length;
  const legalCount = getLegal().length;
  const glossaryCount = getGlossary().length;

  const countryFeatures: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: countries
      .filter((c) => c.frontmatter.capital_coordinates)
      .map((c) => {
        const [lat, lng] = c.frontmatter.capital_coordinates as [number, number];
        return {
          type: 'Feature',
          properties: {
            iso: c.frontmatter.iso,
            name: localizedName(c.frontmatter, typed),
            status: c.frontmatter.status
          },
          geometry: { type: 'Point', coordinates: [lng, lat] }
        };
      })
  };
  const liveCountryFeatures: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: countryFeatures.features.filter((f) => f.properties?.status === 'live')
  };
  const stubCountryFeatures: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: countryFeatures.features.filter((f) => f.properties?.status !== 'live')
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-12 sm:py-20 border-b border-[#e5e5e5]">
        <h1 className="editorial text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.02] max-w-4xl">
          {ts('tagline')}.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-ink-secondary max-w-2xl leading-relaxed">
          {ts('description')}
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#e5e5e5] border-b border-[#e5e5e5]">
        <Stat label={tn('countries')} value={String(live)} />
        <Stat label="Datasets" value={String(datasetCount)} />
        <Stat label={locale === 'fr' ? 'Notions juridiques' : 'Legal concepts'} value={String(legalCount)} />
        <Stat label={tn('glossary')} value={String(glossaryCount)} />
      </section>

      <section className="py-10">
        <MapPanel
          center={[3, 18]}
          zoom={2.4}
          height={520}
          layers={[
            {
              id: 'countries-live',
              label: locale === 'fr' ? 'Pays publiés' : 'Live countries',
              type: 'circle',
              geojson: liveCountryFeatures,
              color: '#0a0a0a'
            },
            {
              id: 'countries-stub',
              label: locale === 'fr' ? 'Ébauches' : 'Stubs',
              type: 'circle',
              geojson: stubCountryFeatures,
              color: '#a3a3a3'
            }
          ]}
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6 sm:p-8 flex flex-col gap-2">
      <span className="label-tiny">{label}</span>
      <span className="text-[2.5rem] font-medium tabular-nums leading-none">{value}</span>
    </div>
  );
}
