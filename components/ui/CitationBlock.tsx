'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { buildAPA, buildBibTeX, buildChicago, buildPermalink, type CitationInput } from '@/lib/citations';
import type { Locale } from '@/lib/i18n/config';

type Style = 'bibtex' | 'apa' | 'chicago' | 'permalink';

export type CitationBlockProps = {
  locale: Locale;
  input: CitationInput;
  pathname: string;
};

export function CitationBlock({ locale, input, pathname }: CitationBlockProps) {
  const t = useTranslations('citation');
  const tc = useTranslations('common');
  const [style, setStyle] = useState<Style>('bibtex');
  const [copied, setCopied] = useState(false);

  const permalink = buildPermalink(pathname);
  const text =
    style === 'bibtex'
      ? buildBibTeX({ ...input, url: permalink })
      : style === 'apa'
      ? buildAPA({ ...input, url: permalink }, locale)
      : style === 'chicago'
      ? buildChicago({ ...input, url: permalink }, locale)
      : permalink;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const tabs: { key: Style; label: string }[] = [
    { key: 'bibtex', label: t('bibtex') },
    { key: 'apa', label: t('apa') },
    { key: 'chicago', label: t('chicago') },
    { key: 'permalink', label: tc('permalink') }
  ];

  return (
    <section className="panel">
      <header className="flex items-center justify-between gap-4 px-5 py-3 hairline">
        <h2 className="text-sm font-medium">{t('heading')}</h2>
        <div className="flex items-center gap-1 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStyle(tab.key)}
              className={`px-2 py-1 ${
                style === tab.key
                  ? 'bg-ink-primary text-white'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      <div className="px-5 py-4 flex flex-col gap-3">
        <pre className="mono text-xs whitespace-pre-wrap break-words bg-surface p-3 border border-[#e5e5e5]">
          {text}
        </pre>
        <button
          type="button"
          onClick={onCopy}
          className="self-end text-xs underline underline-offset-2 text-ink-secondary hover:text-ink-primary"
        >
          {copied ? tc('copied') : tc('copy')}
        </button>
      </div>
    </section>
  );
}
