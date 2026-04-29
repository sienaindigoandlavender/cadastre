import type { Locale } from './i18n/config';

export type CitationInput = {
  title: string;
  url?: string;
  publisher?: string;
  year?: number;
  accessedDate?: string;
  authors?: string[];
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cadastre.dancingwithlions.com';

function isoYear(d: string | undefined): number | undefined {
  if (!d) return undefined;
  const n = new Date(d).getFullYear();
  return Number.isNaN(n) ? undefined : n;
}

export function buildPermalink(path: string): string {
  const trimmed = path.startsWith('/') ? path : `/${path}`;
  return `${SITE}${trimmed}`;
}

export function buildBibTeX(input: CitationInput): string {
  const key = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'cadastre';
  const year = input.year || isoYear(input.accessedDate) || new Date().getFullYear();
  return [
    `@misc{${key}-${year},`,
    `  title = {${input.title}},`,
    `  author = {${(input.authors || ['Cadastre']).join(' and ')}},`,
    `  publisher = {${input.publisher || 'Cadastre'}},`,
    `  year = {${year}},`,
    `  url = {${input.url}},`,
    input.accessedDate ? `  note = {Accessed: ${input.accessedDate}}` : null,
    `}`
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildAPA(input: CitationInput, locale: Locale): string {
  const year = input.year || isoYear(input.accessedDate) || new Date().getFullYear();
  const author = (input.authors || ['Cadastre']).join(', ');
  const retrieved = locale === 'fr' ? 'Consulté à' : 'Retrieved from';
  return `${author} (${year}). ${input.title}. ${input.publisher || 'Cadastre'}. ${retrieved} ${input.url}`;
}

export function buildChicago(input: CitationInput, locale: Locale): string {
  const year = input.year || isoYear(input.accessedDate) || new Date().getFullYear();
  const author = (input.authors || ['Cadastre']).join(', ');
  const accessed = locale === 'fr' ? 'consulté le' : 'accessed';
  return `${author}. "${input.title}." ${input.publisher || 'Cadastre'}, ${year}. ${
    input.accessedDate ? `${accessed} ${input.accessedDate}, ` : ''
  }${input.url}.`;
}
