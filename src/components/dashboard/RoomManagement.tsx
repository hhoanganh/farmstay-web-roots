
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AdminDataTable } from './AdminDataTable';
import { Edit, Trash2 } from 'lucide-react';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info: any) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: (info: any) => info.getValue() || 'Standard',
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: (info: any) => {
      const price = info.getValue();
      return price ? `$${price}` : 'Not set';
    },
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: (info: any) => {
      const desc = info.getValue();
      return desc ? (desc.length > 50 ? `${desc.substring(0, 50)}...` : desc) : 'No description';
    },
  },
];

export default function RoomManagement() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
          type: room.type,
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
      console.error('Error updating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });

      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room',
        variant: 'destructive',
      });
    }
  };

  const rowActions = (room: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditingRoom(room)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(room.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Room Management</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-[hsl(var(--text-secondary))]">Loading rooms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Room Management</h3>
        <Button onClick={() => setEditingRoom({ name: '', description: '', price: '', type: '' })}>
          Add Room
        </Button>
      </div>
      
      <AdminDataTable
        columns={columns}
        data={rooms}
        rowActions={rowActions}
        filterable
        pagination
      />

      {editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-medium mb-4">
              {editingRoom.id ? 'Edit Room' : 'Add Room'}
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={editingRoom.type}
                  onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingRoom.price}
                  onChange={(e) => setEditingRoom({ ...editingRoom, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingRoom.description}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave(editingRoom)}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditingRoom(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
