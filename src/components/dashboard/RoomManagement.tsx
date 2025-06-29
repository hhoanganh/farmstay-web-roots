
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export function RoomManagement() {
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Room Management</h3>
      
      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id} className="border border-[hsl(var(--border-primary))] rounded-lg p-4">
            {editingRoom?.id === room.id ? (
              <div className="space-y-4">
                <div>
                  <Label>Room Name</Label>
                  <Input
                    value={editingRoom.name}
                    onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingRoom.description || ''}
                    onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Price per night</Label>
                  <Input
                    type="number"
                    value={editingRoom.price || ''}
                    onChange={(e) => setEditingRoom({...editingRoom, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(editingRoom)}>Save</Button>
                  <Button variant="outline" onClick={() => setEditingRoom(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{room.name}</h4>
                  <Button variant="outline" size="sm" onClick={() => setEditingRoom(room)}>
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-[hsl(var(--text-secondary))] mb-2">
                  {room.description || 'No description'}
                </p>
                <p className="text-sm font-medium">
                  Price: ${room.price || 'Not set'}/night
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
