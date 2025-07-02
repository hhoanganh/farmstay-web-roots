import AdminLayout from './AdminLayout';
import React from 'react';
import { TasksView } from '@/components/dashboard/TasksView';
import AdminTasksTable from '@/components/dashboard/AdminTasksTable';
import { useAuth } from '@/providers/AuthProvider';
import { useTasks } from '@/hooks/useTasks';

const AdminTasks = () => {
  const { userProfile } = useAuth();
  const { tasks, loading } = useTasks(userProfile?.role, userProfile?.id);

  if (userProfile?.role === 'admin') {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-caveat text-[hsl(var(--text-accent))] mb-6">All Tasks</h1>
        <AdminTasksTable tasks={tasks} />
      </AdminLayout>
    );
  }

  // Staff fallback
  return (
    <AdminLayout>
      <TasksView userRole={userProfile?.role || 'staff'} />
    </AdminLayout>
  );
};

export default AdminTasks; 