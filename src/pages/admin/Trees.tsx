import AdminLayout from './AdminLayout';
import React from 'react';
import { TreesView } from '@/components/dashboard/TreesView';

const AdminTrees = () => {
  return (
    <AdminLayout>
      <TreesView userRole="admin" />
    </AdminLayout>
  );
};

export default AdminTrees;
