
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
        <div className="p-4 border-b border-[hsl(var(--border-primary))]">
          <input
            className="w-full max-w-sm border border-[hsl(var(--border-primary))] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring-focus))]"
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
                  className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--text-secondary))] uppercase tracking-wider cursor-pointer select-none"
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="text-xs">
                        {header.column.getIsSorted() === 'asc' && '↑'}
                        {header.column.getIsSorted() === 'desc' && '↓'}
                        {!header.column.getIsSorted() && '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="px-6 py-3 relative"><span className="sr-only">Actions</span></th>}
            </tr>
          ))}
        </thead>
        <tbody className="bg-[hsl(var(--background-primary))] divide-y divide-[hsl(var(--border-primary))]">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-6 py-8 text-center">
                {emptyState}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-[hsl(var(--background-secondary))]">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--text-primary))]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {rowActions(row.original)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
