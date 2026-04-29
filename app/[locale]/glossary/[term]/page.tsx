import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { findGlossaryTerm, getGlossary } from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedSlug } from '@/lib/i18n/slugs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';
import { CitationBlock } from '@/components/ui/CitationBlock';
import { formatDate } from '@/lib/format';

type Params = { locale: string; term: string };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const term of getGlossary()) {
    for (const locale of locales) {
      out.push({ locale, term: localizedSlug(term.frontmatter, locale) });
    }
  }
  return out;
}

export default async function GlossaryTermPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const term = findGlossaryTerm(params.term);
  if (!term) notFound();
  const fm = term.frontmatter;
  const body = locale === 'fr' ? term.body.fr : term.body.en;
  const display = locale === 'fr' ? fm.term_fr : fm.term_en;
  const opposite = locale === 'fr' ? fm.term_en : fm.term_fr;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: locale === 'fr' ? 'Glossaire' : 'Glossary', href: `/${locale}/glossary` },
            { label: display }
          ]}
        />
      </div>
      <EntityHeader
        kicker={locale === 'fr' ? 'Glossaire' : 'Glossary'}
        title={display}
        subtitle={opposite}
        lastUpdated={formatDate(fm.last_verified, locale)}
        locale={locale}
        alternates={{
          en: `/en/glossary/${fm.slug_en}`,
          fr: `/fr/glossary/${fm.slug_fr}`
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="text-base text-ink-primary leading-relaxed whitespace-pre-line">{body}</div>
        </section>

        <aside className="flex flex-col gap-6">
          {fm.country_variants && fm.country_variants.length > 0 ? (
            <section className="panel p-5">
              <h3 className="label-tiny mb-3">
                {locale === 'fr' ? 'Variantes par pays' : 'Country variants'}
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {fm.country_variants.map((v) => (
                  <li key={v.iso} className="flex items-baseline justify-between gap-3">
                    <span className="text-ink-secondary mono text-xs">{v.iso}</span>
                    <Link
                      href={`/${locale}${v.link}`}
                      className="editorial hover:underline"
                    >
                      {v.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {fm.related_terms && fm.related_terms.length > 0 ? (
            <section className="panel p-5">
              <h3 className="label-tiny mb-3">{locale === 'fr' ? 'Termes liés' : 'Related terms'}</h3>
              <ul className="flex flex-col gap-1 text-sm">
                {fm.related_terms.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${locale}/glossary/${slug}`} className="text-ink-secondary hover:text-ink-primary">
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
          pathname={`/${locale}/glossary/${localizedSlug(fm, locale)}`}
          input={{
            title: `${display} — Cadastre`,
            publisher: 'Cadastre',
            accessedDate: fm.last_verified
          }}
        />
      </section>
    </div>
  );
}
