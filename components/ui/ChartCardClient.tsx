'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export type ChartCardClientProps = {
  title: string;
  subtitle?: string;
  hasTable: boolean;
  hasData: boolean;
  emptyMessage?: string;
  footer?: React.ReactNode;
  chart: React.ReactNode;
  table?: React.ReactNode;
};

export function ChartCardClient({
  title,
  subtitle,
  hasTable,
  hasData,
  emptyMessage,
  footer,
  chart,
  table
}: ChartCardClientProps) {
  const t = useTranslations('common');
  const [showData, setShowData] = useState(false);

  return (
    <section className="panel flex flex-col">
      <header className="flex items-start justify-between gap-4 px-5 py-4 hairline">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="text-sm font-medium text-ink-primary leading-tight">{title}</h3>
          {subtitle ? <p className="text-xs text-ink-secondary">{subtitle}</p> : null}
        </div>
        {hasData && hasTable ? (
          <button
            type="button"
            onClick={() => setShowData((v) => !v)}
            className="text-xs underline underline-offset-2 text-ink-secondary hover:text-ink-primary shrink-0"
          >
            {showData ? t('viewChart') : t('viewData')}
          </button>
        ) : null}
      </header>

      <div className="px-5 py-5 flex-1 min-h-[260px] flex">
        {hasData ? (
          showData && table ? (
            <div className="flex-1 overflow-auto">{table}</div>
          ) : (
            <div className="flex-1">{chart}</div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-ink-tertiary">
            {emptyMessage || t('noData')}
          </div>
        )}
      </div>

      {footer ? <footer className="px-5 py-3 hairline border-t border-b-0">{footer}</footer> : null}
    </section>
  );
}
