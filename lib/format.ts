import type { Locale } from './i18n/config';

export function formatNumber(value: number | null | undefined, locale: Locale, opts?: Intl.NumberFormatOptions): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', opts).format(value);
}

export function formatCompactNumber(value: number | null | undefined, locale: Locale): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number | null | undefined, locale: Locale, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

export function formatCurrency(
  value: number | null | undefined,
  currency: string,
  locale: Locale
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
}
