'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, type Locale, localeNames } from '@/lib/i18n/config';

export type LocaleToggleProps = {
  current: Locale;
  alternates?: Partial<Record<Locale, string>>;
};

export function LocaleToggle({ current, alternates }: LocaleToggleProps) {
  const t = useTranslations('locale');
  const pathname = usePathname();

  function altPath(target: Locale): string {
    if (alternates?.[target]) return alternates[target] as string;
    if (!pathname) return `/${target}`;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return `/${target}`;
    parts[0] = target;
    return '/' + parts.join('/');
  }

  return (
    <nav aria-label={t('switchTo')} className="flex items-center gap-1 text-xs">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 ? <span className="text-ink-tertiary">·</span> : null}
          {l === current ? (
            <span aria-current="true" className="font-medium text-ink-primary uppercase">
              {l}
            </span>
          ) : (
            <Link
              href={altPath(l)}
              hrefLang={l}
              className="uppercase text-ink-secondary hover:text-ink-primary"
              title={localeNames[l]}
            >
              {l}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
