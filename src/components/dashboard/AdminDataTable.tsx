import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

interface AdminDataTableProps<T extends object> {
  columns: any[];
  data: T[];
  rowActions?: (row: T) => React.ReactNode;
  initialSort?: any;
  filterable?: boolean | string[];
  pagination?: boolean;
  emptyState?: React.ReactNode;
}

export function AdminDataTable<T extends object>({
  columns,
  data,
  rowActions,
  initialSort,
  filterable = true,
  pagination = true,
  emptyState = <div className="py-8 text-center text-[hsl(var(--text-secondary))]">No data found.</div>,
}: AdminDataTableProps<T>) {
  const [sorting, setSorting] = React.useState(initialSort || []);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-[hsl(var(--border-primary))] bg-[hsl(var(--background-primary))]">
      {filterable && (
        <div className="p-2 flex items-center gap-2">
          <input
            className="border border-[hsl(var(--border-primary))] rounded px-3 py-2 min-h-[44px] font-inter focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring-focus))]"
            placeholder="Search..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
          />
        </div>
      )}
      <table className="min-w-full divide-y divide-[hsl(var(--border-primary))]">
        <thead className="bg-[hsl(var(--background-secondary))]">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-inter text-[hsl(var(--text-primary))] text-sm font-semibold select-none cursor-pointer"
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  style={{ minWidth: 80 }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' && ' ▲'}
                  {header.column.getIsSorted() === 'desc' && ' ▼'}
                </th>
              ))}
              {rowActions && <th className="px-4 py-3"></th>}
            </tr>
          ))}
        </thead>
        <tbody className="bg-[hsl(var(--background-primary))]">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (rowActions ? 1 : 0)}>{emptyState}</td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--background-secondary))]">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 font-inter text-[hsl(var(--text-primary))] text-sm align-middle min-h-[44px]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {rowActions && <td className="px-4 py-3">{rowActions(row.original)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination (simple client-side) */}
      {/* Add advanced pagination as needed */}
    </div>
  );
} 