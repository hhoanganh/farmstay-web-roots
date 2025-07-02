import AdminLayout from './AdminLayout';
import React from 'react';
import { TasksView } from '@/components/dashboard/TasksView';

const AdminTasks = () => {
  return (
    <AdminLayout>
      <TasksView userRole="admin" />
    </AdminLayout>
  );
};

export default AdminTasks; 