import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getGlossary } from '@/lib/content/loader';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { localizedSlug } from '@/lib/i18n/slugs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';

type Params = { locale: string };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function GlossaryIndex({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const terms = getGlossary().sort((a, b) =>
    (locale === 'fr' ? a.frontmatter.term_fr : a.frontmatter.term_en).localeCompare(
      locale === 'fr' ? b.frontmatter.term_fr : b.frontmatter.term_en
    )
  );

  const grouped = terms.reduce<Record<string, typeof terms>>((acc, t) => {
    (acc[t.frontmatter.category] ||= []).push(t);
    return acc;
  }, {});

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb locale={locale} items={[{ label: locale === 'fr' ? 'Glossaire' : 'Glossary' }]} />
      </div>
      <EntityHeader
        kicker="Cadastre"
        title={locale === 'fr' ? 'Glossaire' : 'Glossary'}
        subtitle={
          locale === 'fr'
            ? `${terms.length} termes documentés`
            : `${terms.length} terms documented`
        }
        locale={locale}
      />
      <div className="flex flex-col gap-12">
        {Object.entries(grouped).map(([cat, list]) => (
          <section key={cat}>
            <h2 className="label-tiny mb-3 capitalize">{cat.replace(/_/g, ' ')}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
              {list.map((t) => (
                <li key={t.frontmatter.slug_en} className="bg-white">
                  <Link
                    href={`/${locale}/glossary/${localizedSlug(t.frontmatter, locale)}`}
                    className="block p-5 hover:bg-surface"
                  >
                    <p className="editorial text-base font-medium">
                      {locale === 'fr' ? t.frontmatter.term_fr : t.frontmatter.term_en}
                    </p>
                    <p className="text-xs text-ink-tertiary mt-0.5">
                      {locale === 'fr' ? t.frontmatter.term_en : t.frontmatter.term_fr}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
