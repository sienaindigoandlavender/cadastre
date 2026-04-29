import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { findCountryBySlug, findLegal, getCountries, getLegal } from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';
import { CitationBlock } from '@/components/ui/CitationBlock';
import { formatDate } from '@/lib/format';

type Params = { locale: string; country: string; topic: string };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const legal of getLegal()) {
    const country = getCountries().find((c) => c.frontmatter.iso === legal.frontmatter.iso);
    if (!country) continue;
    for (const locale of locales) {
      out.push({
        locale,
        country: localizedSlug(country.frontmatter, locale),
        topic: localizedSlug(legal.frontmatter, locale)
      });
    }
  }
  return out;
}

export default async function LegalTopicPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const country = findCountryBySlug(locale, params.country);
  if (!country) notFound();
  const legal = findLegal(country.frontmatter.iso, params.topic);
  if (!legal) notFound();

  const fm = legal.frontmatter;
  const body = locale === 'fr' ? legal.body.fr : legal.body.en;

  const quickFacts: Array<{ label: string; value: string }> = [];
  if (fm.governing_law) {
    quickFacts.push({
      label: locale === 'fr' ? 'Loi applicable' : 'Governing law',
      value: fm.governing_law
    });
  }
  quickFacts.push({
    label: locale === 'fr' ? 'Catégorie' : 'Category',
    value: fm.category.replace(/_/g, ' ')
  });
  if (fm.official_french_term) {
    quickFacts.push({
      label: locale === 'fr' ? 'Terme officiel (FR)' : 'Official term (FR)',
      value: fm.official_french_term
    });
  }
  if (fm.plain_english_term) {
    quickFacts.push({
      label: locale === 'fr' ? 'Terme courant (EN)' : 'Plain English',
      value: fm.plain_english_term
    });
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: localizedName(country.frontmatter, locale), href: `/${locale}/${params.country}` },
            { label: locale === 'fr' ? 'Notions juridiques' : 'Legal concepts', href: `/${locale}/${params.country}/legal` },
            { label: localizedName(fm, locale) }
          ]}
        />
      </div>
      <EntityHeader
        kicker={`${localizedName(country.frontmatter, locale)} · ${
          locale === 'fr' ? 'Notion juridique' : 'Legal concept'
        }`}
        title={localizedName(fm, locale)}
        lastUpdated={formatDate(fm.last_updated, locale)}
        locale={locale}
        alternates={{
          en: `/en/${country.frontmatter.slug_en}/legal/${fm.slug_en}`,
          fr: `/fr/${country.frontmatter.slug_fr}/legal/${fm.slug_fr}`
        }}
        status={fm.status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <section className="lg:col-span-2">
          <div className="text-sm sm:text-base text-ink-primary leading-relaxed whitespace-pre-line">
            {body}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="panel p-5">
            <h3 className="label-tiny mb-3">{locale === 'fr' ? 'En bref' : 'Quick facts'}</h3>
            <dl className="flex flex-col gap-3 text-sm">
              {quickFacts.map((f, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <dt className="text-xs text-ink-tertiary">{f.label}</dt>
                  <dd className="text-ink-primary">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {fm.parallel_systems_other_countries && fm.parallel_systems_other_countries.length > 0 ? (
            <section className="panel p-5">
              <h3 className="label-tiny mb-3">
                {locale === 'fr' ? 'Systèmes parallèles' : 'Parallel systems'}
              </h3>
              <ul className="flex flex-col gap-1.5 text-sm">
                {fm.parallel_systems_other_countries.map((p, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3">
                    <span className="text-ink-secondary mono text-xs">{p.country}</span>
                    <span className="editorial">{p.concept}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {fm.related_concepts && fm.related_concepts.length > 0 ? (
            <section className="panel p-5">
              <h3 className="label-tiny mb-3">{locale === 'fr' ? 'Notions liées' : 'Related concepts'}</h3>
              <ul className="flex flex-col gap-1 text-sm">
                {fm.related_concepts.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/${locale}/${params.country}/legal/${slug}`}
                      className="text-ink-secondary hover:text-ink-primary"
                    >
                      {slug.replace(/-/g, ' ')}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>

      <section className="mt-10">
        <CitationBlock
          locale={locale}
          pathname={`/${locale}/${params.country}/legal/${localizedSlug(fm, locale)}`}
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
