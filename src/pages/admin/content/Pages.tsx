
import AdminLayout from '../AdminLayout';
import React from 'react';

const AdminPages = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-caveat text-[hsl(var(--text-accent))]">
          Pages Management
        </h1>
        <p className="text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          Manage your website pages content here.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminPages;
