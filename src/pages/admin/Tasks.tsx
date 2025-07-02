import AdminLayout from './AdminLayout';
import React from 'react';
import { TasksView } from '@/components/dashboard/TasksView';
import { useAuth } from '@/providers/AuthProvider';

const AdminTasks = () => {
  const { userProfile } = useAuth();
  return (
    <AdminLayout>
      <TasksView userRole={userProfile?.role || 'staff'} />
    </AdminLayout>
  );
};

export default AdminTasks; 