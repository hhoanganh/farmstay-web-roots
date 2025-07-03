import React from 'react';
import { AdminDataTable } from './AdminDataTable';

interface AssetManagementModalProps {
  open: boolean;
  onClose: () => void;
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: info => info.getValue(),
  },
];

export default function AssetManagementModal({ open, onClose }: AssetManagementModalProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[hsl(var(--border-primary))] bg-[hsl(var(--background-primary))]">
      <AdminDataTable
        columns={columns}
        data={[]}
        filterable
        pagination
      />
    </div>
  );
}
