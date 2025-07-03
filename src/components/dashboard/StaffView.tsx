import React from 'react';
import { AdminDataTable } from './AdminDataTable';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  email?: string;
  phone?: string;
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: info => info.getValue(),
  },
];

export default function StaffView() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProfiles(data);
    }
  };

  const handleRemoveStaff = async (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (!error) {
        setProfiles(profiles.filter(profile => profile.id !== id));
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'staff':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Transform staff as needed to match column keys
  const data = profiles.map(member => ({
    name: member.full_name,
    role: member.role,
    email: member.email || '-',
    phone: member.phone || '-',
  }));

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 
            className="text-4xl text-[hsl(var(--text-accent))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Staff
          </h1>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Manage team members and their roles
          </p>
        </div>
        <Button 
          className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90 h-12"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      {/* Staff List */}
      <div className="overflow-x-auto rounded-lg border border-[hsl(var(--border-primary))] bg-[hsl(var(--background-primary))]">
        <AdminDataTable
          columns={columns}
          data={data}
          filterable
          pagination
        />
      </div>
    </div>
  );
}
