'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export type DistroPoint = { label: string; value: number };

const PALETTE = [
  '#1f4e79',
  '#c47e3c',
  '#5a8c5a',
  '#9b3939',
  '#6a5a8c',
  '#8c7a3c',
  '#3c8c8c',
  '#595959'
];

export function DistributionChart({ data, horizontal = true }: { data: DistroPoint[]; horizontal?: boolean }) {
  if (!data || data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={220}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
      >
        <CartesianGrid stroke="#f0f0f0" horizontal={!horizontal} vertical={horizontal} />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#737373' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              domain={[0, 1]}
            />
            <YAxis
              dataKey="label"
              type="category"
              tick={{ fontSize: 11, fill: '#525252' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e5e5' }}
              width={120}
            />
          </>
        ) : (
          <>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#737373' }} tickLine={false} axisLine={{ stroke: '#e5e5e5' }} />
            <YAxis tick={{ fontSize: 11, fill: '#737373' }} tickLine={false} axisLine={false} />
          </>
        )}
        <Tooltip
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            fontSize: 12,
            padding: '6px 8px'
          }}
          formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, '']}
        />
        <Bar dataKey="value" isAnimationActive animationDuration={500}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
