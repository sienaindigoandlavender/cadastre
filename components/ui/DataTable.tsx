import { cn } from '@/lib/cn';

export type DataTableCell = {
  value: React.ReactNode;
  align?: 'left' | 'right';
  mono?: boolean;
};

export type DataTableProps = {
  headers: { label: string; align?: 'left' | 'right' }[];
  rows: DataTableCell[][];
  caption?: string;
};

export function DataTable({ headers, rows, caption }: DataTableProps) {
  return (
    <table className="w-full text-sm border-collapse">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead className="sticky top-0 bg-white">
        <tr className="border-b border-[#e5e5e5]">
          {headers.map((h, i) => (
            <th
              key={i}
              scope="col"
              className={cn('label-tiny py-2 px-2', h.align === 'right' ? 'text-right' : 'text-left')}
            >
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-[#f0f0f0]">
            {row.map((cell, j) => (
              <td
                key={j}
                className={cn(
                  'py-2 px-2',
                  cell.mono ? 'mono text-xs' : 'tabular-nums',
                  cell.align === 'right' ? 'text-right' : 'text-left'
                )}
              >
                {cell.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
