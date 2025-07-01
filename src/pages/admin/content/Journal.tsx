import AdminLayout from '../AdminLayout';
import React from 'react';
import { JournalView } from '@/components/dashboard/JournalView';

const AdminJournal = () => {
  return (
    <AdminLayout>
      <JournalView />
    </AdminLayout>
  );
};

export default AdminJournal;
