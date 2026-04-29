import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { getCountries } from '@/lib/content/loader';
import { localizedSlug, localizedName } from '@/lib/i18n/slugs';
import type { Locale } from '@/lib/i18n/config';

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const ts = useTranslations('site');
  const countries = getCountries()
    .filter((c) => c.frontmatter.status === 'live')
    .sort((a, b) =>
      localizedName(a.frontmatter, locale).localeCompare(
        localizedName(b.frontmatter, locale)
      )
    );

  return (
    <header className="border-b border-[#e5e5e5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-6">
        <Link href={`/${locale}`} className="flex items-baseline gap-2 shrink-0">
          <span className="text-base font-medium tracking-tight">{ts('name')}</span>
          <span className="hidden sm:inline text-xs text-ink-tertiary">— {ts('tagline')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <details className="relative group">
            <summary className="list-none cursor-pointer text-ink-secondary hover:text-ink-primary">
              {t('countries')}
            </summary>
            <div className="absolute right-0 top-full mt-1 w-56 panel z-50">
              <ul className="py-2">
                {countries.map((c) => (
                  <li key={c.frontmatter.iso}>
                    <Link
                      href={`/${locale}/${localizedSlug(c.frontmatter, locale)}`}
                      className="block px-4 py-1.5 text-sm hover:bg-surface"
                    >
                      {localizedName(c.frontmatter, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
          <Link href={`/${locale}/glossary`} className="text-ink-secondary hover:text-ink-primary">
            {t('glossary')}
          </Link>
          <Link href={`/${locale}/methodology`} className="text-ink-secondary hover:text-ink-primary">
            {t('methodology')}
          </Link>
          <Link href={`/${locale}/sources`} className="text-ink-secondary hover:text-ink-primary">
            {t('sources')}
          </Link>
          <Link href={`/${locale}/about`} className="text-ink-secondary hover:text-ink-primary">
            {t('about')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LocaleToggle current={locale} />
        </div>
      </div>
    </header>
  );
}
