import { KpiStat, type KpiStatProps } from './KpiStat';

export type KpiStripProps = {
  metrics: KpiStatProps[];
};

export function KpiStrip({ metrics }: KpiStripProps) {
  return (
    <div className="border-y border-[#e5e5e5] -mx-4 sm:mx-0">
      <div className="flex gap-10 overflow-x-auto px-4 sm:px-6 py-6 sm:py-8 snap-x">
        {metrics.map((m, i) => (
          <div key={i} className="snap-start flex-shrink-0">
            <KpiStat {...m} />
          </div>
        ))}
      </div>
    </div>
  );
}
