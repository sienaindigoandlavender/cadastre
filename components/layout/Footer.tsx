import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n/config';

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const ts = useTranslations('site');

  return (
    <footer className="border-t border-[#e5e5e5] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-2 flex flex-col gap-2">
          <span className="font-medium">{ts('name')}</span>
          <p className="text-xs text-ink-secondary max-w-md">{ts('description')}</p>
        </div>
        <ul className="flex flex-col gap-2">
          <li className="label-tiny">{tn('countries')}</li>
          <li>
            <Link href={`/${locale}/methodology`} className="text-ink-secondary hover:text-ink-primary">
              {tn('methodology')}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/sources`} className="text-ink-secondary hover:text-ink-primary">
              {tn('sources')}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/glossary`} className="text-ink-secondary hover:text-ink-primary">
              {tn('glossary')}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/about`} className="text-ink-secondary hover:text-ink-primary">
              {tn('about')}
            </Link>
          </li>
        </ul>
        <ul className="flex flex-col gap-2">
          <li className="label-tiny">{t('contact')}</li>
          <li>
            <a
              href="mailto:cadastre@dancingwithlions.com"
              className="text-ink-secondary hover:text-ink-primary mono text-xs break-all"
            >
              cadastre@dancingwithlions.com
            </a>
          </li>
        </ul>
      </div>
      <div className="border-t border-[#e5e5e5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-ink-tertiary">
          <span>{t('rights')}</span>
          <span className="mono">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
