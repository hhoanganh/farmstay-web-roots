import AdminLayout from './AdminLayout';
import React from 'react';
import TasksTable from '@/components/dashboard/TasksTable';
import { useAuth } from '@/providers/AuthProvider';
import { useTasks } from '@/hooks/useTasks';

const AdminTasks = () => {
  const { userProfile } = useAuth();
  const { tasks, loading } = useTasks(userProfile?.role, userProfile?.id);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-caveat text-[hsl(var(--text-accent))] mb-6">Tasks</h1>
      <TasksTable tasks={tasks} userRole={userProfile?.role || 'staff'} />
    </AdminLayout>
  );
};

export default AdminTasks; 