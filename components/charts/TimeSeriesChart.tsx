'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export type SeriesPoint = { period: string; value: number };

export type TimeSeriesChartProps = {
  data: SeriesPoint[];
  color?: string;
  yLabel?: string;
};

const tickFmt = (v: number) =>
  Math.abs(v) >= 1000
    ? new Intl.NumberFormat('en', { notation: 'compact' }).format(v)
    : String(v);

export function TimeSeriesChart({ data, color = '#1f4e79', yLabel }: TimeSeriesChartProps) {
  if (!data || data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: '#737373' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
          minTickGap={20}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#737373' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={tickFmt}
          width={48}
          label={
            yLabel
              ? { value: yLabel, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#737373' }
              : undefined
          }
        />
        <Tooltip
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            fontSize: 12,
            padding: '6px 8px'
          }}
          labelStyle={{ color: '#0a0a0a', fontWeight: 500 }}
          formatter={(v: number) => [v.toLocaleString(), '']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
