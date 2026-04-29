import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getCountries } from '@/lib/content/loader';
import { localizedName, localizedSlug } from '@/lib/i18n/slugs';
import type { Locale } from '@/lib/i18n/config';

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const ts = useTranslations('site');

  const countries = getCountries().sort((a, b) =>
    localizedName(a.frontmatter, locale).localeCompare(localizedName(b.frontmatter, locale))
  );

  return (
    <footer className="border-t border-[#e5e5e5] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-2 flex flex-col gap-2">
          <span className="font-medium">{ts('name')}</span>
          <p className="text-xs text-ink-secondary max-w-md">{ts('description')}</p>
        </div>
        <ul className="flex flex-col gap-2">
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
      </div>
      <div className="border-t border-[#e5e5e5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-tertiary">
          <nav aria-label={tn('countries')} className="flex flex-wrap items-center gap-2 mono uppercase tracking-[0.08em]">
            {countries.map((c, i) => (
              <span key={c.frontmatter.iso} className="flex items-center gap-2">
                {i > 0 ? <span className="text-ink-tertiary">|</span> : null}
                <Link
                  href={`/${locale}/${localizedSlug(c.frontmatter, locale)}`}
                  className="hover:text-ink-primary"
                >
                  {localizedName(c.frontmatter, locale)}
                </Link>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span>{t('rights')}</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
