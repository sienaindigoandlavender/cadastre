import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EntityHeader } from '@/components/ui/EntityHeader';

type Params = { locale: string };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const COPY: Record<Locale, { title: string; paragraphs: string[] }> = {
  en: {
    title: 'About',
    paragraphs: [
      'Cadastre is an open reference for real estate, cadastral, legal, and built-environment data across African countries. It is a structured wiki, dashboard-first, bilingual French and English from inception.',
      'The project has no editorial voice, no marketing copy, and no founder bio. Pages display facts and figures with provenance, citations, and licensed sources. Where data is unavailable, surfaces explicitly say so.',
      'Country is a top-level routing dimension. Morocco is the first country populated; the schema is continental. Datasets are catalogued in a public registry with publisher, license, fetch method, and last-fetched timestamp.'
    ]
  },
  fr: {
    title: 'À propos',
    paragraphs: [
      'Cadastre est une référence ouverte sur les données immobilières, cadastrales, juridiques et bâties des pays africains. Il s’agit d’un wiki structuré, conçu comme tableau de bord, bilingue français-anglais dès l’origine.',
      'Le projet n’a pas de ligne éditoriale, pas de copie marketing, pas de biographie de fondateur. Les pages présentent des faits et des chiffres assortis de provenance, de citations et de sources licenciées. Lorsqu’une donnée est indisponible, l’interface l’indique explicitement.',
      'Le pays est une dimension de routage de premier niveau. Le Maroc est le premier pays alimenté ; le schéma est continental. Les jeux de données sont catalogués dans un registre public mentionnant éditeur, licence, méthode de collecte et date de dernière collecte.'
    ]
  }
};

export default async function AboutPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const copy = COPY[locale];
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6">
        <Breadcrumb locale={locale} items={[{ label: copy.title }]} />
      </div>
      <EntityHeader kicker="Cadastre" title={copy.title} locale={locale} />
      <article className="flex flex-col gap-6 max-w-2xl">
        {copy.paragraphs.map((p, i) => (
          <p key={i} className="text-base text-ink-primary leading-relaxed">
            {p}
          </p>
        ))}
      </article>
    </div>
  );
}
