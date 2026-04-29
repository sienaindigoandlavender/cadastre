import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n/config';

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, locale }: { items: Crumb[]; locale: Locale }) {
  const t = useTranslations('breadcrumb');
  const all: Crumb[] = [{ label: t('home'), href: `/${locale}` }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink-secondary">
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-ink-primary">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink-primary">{c.label}</span>
            )}
            {i < all.length - 1 ? <span aria-hidden className="text-ink-tertiary">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
