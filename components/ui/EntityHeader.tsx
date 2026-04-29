import { useTranslations } from 'next-intl';
import { LocaleToggle } from './LocaleToggle';
import type { Locale } from '@/lib/i18n/config';

export type EntityHeaderProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  locale: Locale;
  alternates?: Partial<Record<Locale, string>>;
  status?: 'live' | 'draft' | 'stub';
};

export function EntityHeader({
  kicker,
  title,
  subtitle,
  lastUpdated,
  locale,
  alternates,
  status
}: EntityHeaderProps) {
  const t = useTranslations('common');
  const ts = useTranslations('status');
  return (
    <header className="flex flex-col gap-4 py-8 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <span className="label-tiny">{kicker}</span>
        <div className="flex items-center gap-4">
          {status && status !== 'live' ? (
            <span className="label-tiny text-ink-tertiary border border-[#e5e5e5] px-1.5 py-0.5">
              {ts(status)}
            </span>
          ) : null}
          <LocaleToggle current={locale} alternates={alternates} />
        </div>
      </div>
      <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.05]">
        {title}
      </h1>
      {subtitle ? <p className="text-base sm:text-lg text-ink-secondary max-w-3xl">{subtitle}</p> : null}
      {lastUpdated ? (
        <p className="text-xs text-ink-tertiary mono">
          {t('lastUpdated')}: {lastUpdated}
        </p>
      ) : null}
    </header>
  );
}
