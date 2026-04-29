import { useTranslations } from 'next-intl';

export type SourceLineProps = {
  publisher?: string;
  url?: string;
  fetched?: string;
  license?: string;
};

export function SourceLine({ publisher, url, fetched, license }: SourceLineProps) {
  const t = useTranslations('common');
  return (
    <p className="text-xs text-ink-tertiary mono leading-relaxed">
      {publisher ? (
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
            {publisher}
          </a>
        ) : (
          <span>{publisher}</span>
        )
      ) : null}
      {fetched ? (
        <span>
          {' '}· {t('lastFetched')}: {fetched}
        </span>
      ) : null}
      {license ? (
        <span>
          {' '}· {t('license')}: {license}
        </span>
      ) : null}
    </p>
  );
}
