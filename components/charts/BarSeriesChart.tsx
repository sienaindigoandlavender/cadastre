'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export type BarPoint = { label: string; value: number };

export function BarSeriesChart({
  data,
  color = '#1f4e79'
}: {
  data: BarPoint[];
  color?: string;
}) {
  if (!data || data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#737373' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#737373' }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            fontSize: 12,
            padding: '6px 8px'
          }}
          formatter={(v: number) => [v.toLocaleString(), '']}
        />
        <Bar dataKey="value" fill={color} isAnimationActive animationDuration={500} />
      </BarChart>
    </ResponsiveContainer>
  );
}
