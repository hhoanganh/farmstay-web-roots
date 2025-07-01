import AdminLayout from './AdminLayout';
import React from 'react';
import { BookingsView } from '@/components/dashboard/BookingsView';

const AdminBookings = () => {
  return (
    <AdminLayout>
      <BookingsView userRole="admin" />
    </AdminLayout>
  );
};

export default AdminBookings;
