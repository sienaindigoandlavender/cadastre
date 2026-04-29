import { cn } from '@/lib/cn';

export type KpiTrend = 'up' | 'down' | 'flat' | null;

export type KpiStatProps = {
  label: string;
  value: string;
  unit?: string;
  trend?: KpiTrend;
  trendValue?: string;
  meta?: string;
  size?: 'md' | 'lg';
};

export function KpiStat({ label, value, unit, trend, trendValue, meta, size = 'md' }: KpiStatProps) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <span className="label-tiny">{label}</span>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'tabular-nums font-medium leading-none text-ink-primary',
            size === 'lg' ? 'text-[3rem] sm:text-[3.5rem]' : 'text-[2rem] sm:text-[2.5rem]'
          )}
        >
          {value}
        </span>
        {unit ? <span className="text-sm text-ink-secondary">{unit}</span> : null}
      </div>
      {(trend || trendValue || meta) && (
        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          {trend && (
            <span
              className={cn(
                trend === 'up' && 'text-positive',
                trend === 'down' && 'text-negative',
                trend === 'flat' && 'text-ink-tertiary'
              )}
              aria-hidden
            >
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
            </span>
          )}
          {trendValue ? <span className="tabular-nums">{trendValue}</span> : null}
          {meta ? <span className="text-ink-tertiary">{meta}</span> : null}
        </div>
      )}
    </div>
  );
}
