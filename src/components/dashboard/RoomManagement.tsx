import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AdminDataTable } from './AdminDataTable';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: info => `$${info.getValue()}`,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => info.getValue(),
    enableSorting: true,
  },
];

export default function RoomManagement() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .order('name');
    
    if (data) {
      setRooms(data);
    }
  };

  const handleSave = async (room: any) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({
          name: room.name,
          description: room.description,
          price: room.price,
        })
        .eq('id', room.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Room updated successfully',
      });

      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update room',
        variant: 'destructive',
      });
    }
  };

  // Transform rooms as needed to match column keys
  const data = rooms.map(room => ({
    name: room.name,
    type: room.type || '-',
    price: room.price,
    status: room.status || '-',
    // ...add other fields as needed
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Room Management</h3>
      
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
