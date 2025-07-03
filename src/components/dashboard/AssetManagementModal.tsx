
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
    cell: (info: any) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: (info: any) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info: any) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: (info: any) => info.getValue(),
  },
];

// Sample data for demonstration
const sampleData = [
  {
    id: '1',
    name: 'Garden Tools Set',
    type: 'Equipment',
    status: 'Available',
    location: 'Storage Shed'
  },
  {
    id: '2',
    name: 'Irrigation System',
    type: 'Infrastructure',
    status: 'In Use',
    location: 'East Garden'
  }
];

export default function AssetManagementModal({ open, onClose }: AssetManagementModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Asset Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-auto max-h-[60vh]">
          <AdminDataTable
            columns={columns}
            data={sampleData}
            filterable
            pagination
          />
        </div>
      </div>
    </div>
  );
}
