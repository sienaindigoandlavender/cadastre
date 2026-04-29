import Link from 'next/link';

export type SidebarItem = {
  label: string;
  href: string;
  meta?: string;
  active?: boolean;
};

export type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

export function Sidebar({ sections }: { sections: SidebarSection[] }) {
  return (
    <aside className="flex flex-col gap-8">
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-2">
          <h3 className="label-tiny">{section.title}</h3>
          <ul className="flex flex-col gap-1">
            {section.items.map((item, j) => (
              <li key={j} className="text-sm">
                <Link
                  href={item.href}
                  className={`flex items-baseline justify-between gap-3 py-1 ${
                    item.active
                      ? 'text-ink-primary font-medium'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.meta ? (
                    <span className="text-xs text-ink-tertiary tabular-nums shrink-0">{item.meta}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
