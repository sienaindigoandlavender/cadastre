import { ChartCardClient } from './ChartCardClient';
import { SourceLine, type SourceLineProps } from './SourceLine';

export type ChartCardProps = {
  title: string;
  subtitle?: string;
  source?: SourceLineProps;
  chart: React.ReactNode;
  table?: React.ReactNode;
  hasData?: boolean;
  emptyMessage?: string;
};

export function ChartCard({
  title,
  subtitle,
  source,
  chart,
  table,
  hasData = true,
  emptyMessage
}: ChartCardProps) {
  return (
    <ChartCardClient
      title={title}
      subtitle={subtitle}
      hasTable={Boolean(table)}
      hasData={hasData}
      emptyMessage={emptyMessage}
      footer={source ? <SourceLine {...source} /> : null}
      chart={chart}
      table={table}
    />
  );
}
