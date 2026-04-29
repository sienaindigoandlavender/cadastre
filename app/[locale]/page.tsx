import Link from 'next/link';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getCountries, getDatasets, getGlossary, getLegal } from '@/lib/content/loader';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
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
  const stub = countries.filter((c) => c.frontmatter.status === 'stub').length;
  const datasetCount = getDatasets().length;
  const legalCount = getLegal().length;
  const glossaryCount = getGlossary().length;

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
        <Stat label={tn('countries')} value={String(live)} meta={stub > 0 ? `+${stub}` : undefined} />
        <Stat label="Datasets" value={String(datasetCount)} />
        <Stat label={locale === 'fr' ? 'Notions juridiques' : 'Legal concepts'} value={String(legalCount)} />
        <Stat label={tn('glossary')} value={String(glossaryCount)} />
      </section>

      <section className="py-12">
        <h2 className="label-tiny mb-6">{tn('countries')}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
          {countries.map((c) => (
            <li key={c.frontmatter.iso} className="bg-white">
              <Link
                href={`/${locale}/${localizedSlug(c.frontmatter, typed)}`}
                className="block p-5 hover:bg-surface transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-medium">{localizedName(c.frontmatter, typed)}</span>
                    <span className="text-xs text-ink-tertiary">{c.frontmatter.iso} · {c.frontmatter.capital}</span>
                  </div>
                  <span className="label-tiny">
                    {c.frontmatter.status === 'live' ? '●' : c.frontmatter.status === 'stub' ? '○' : '◐'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, meta }: { label: string; value: string; meta?: string }) {
  return (
    <div className="bg-white p-6 sm:p-8 flex flex-col gap-2">
      <span className="label-tiny">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[2.5rem] font-medium tabular-nums leading-none">{value}</span>
        {meta ? <span className="text-xs text-ink-tertiary">{meta}</span> : null}
      </div>
    </div>
  );
}
