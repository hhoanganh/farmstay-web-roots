import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface RoomManagementModalProps {
  open: boolean;
  onClose: () => void;
  refreshRooms: () => void;
}

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
}

export function RoomManagementModal({ open, onClose, refreshRooms }: RoomManagementModalProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) fetchRooms();
  }, [open]);

  const fetchRooms = async () => {
    setLoading(true);
    const { data } = await supabase.from('rooms').select('*').order('name');
    setRooms(data || []);
    setLoading(false);
  };

  const openForm = (room?: Room) => {
    setEditingRoom(room || null);
    setName(room?.name || '');
    setDescription(room?.description || '');
    setPrice(room ? String(room.price) : '');
    setImageUrls(room?.image_urls?.join(',') || '');
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingRoom(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrls('');
    setFormOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || isNaN(Number(price))) {
      toast({ title: 'Name and valid price are required.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const payload = {
      name,
      description,
      price: Number(price),
      image_urls: imageUrls ? imageUrls.split(',').map(url => url.trim()) : [],
    };
    let error;
    if (editingRoom) {
      ({ error } = await supabase.from('rooms').update(payload).eq('id', editingRoom.id));
    } else {
      ({ error } = await supabase.from('rooms').insert(payload));
    }
    setLoading(false);
    if (error) {
      toast({ title: 'Failed to save room', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Room saved' });
      closeForm();
      fetchRooms();
      refreshRooms();
    }
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;
    setLoading(true);
    const { error } = await supabase.from('rooms').delete().eq('id', roomToDelete.id);
    setLoading(false);
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
    if (error) {
      toast({ title: 'Failed to delete room', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Room deleted' });
      fetchRooms();
      refreshRooms();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Rooms</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Button onClick={() => openForm()} className="mb-2">+ Add Room</Button>
          {loading ? <div>Loading...</div> : (
            <ul className="space-y-2">
              {rooms.map(room => (
                <li key={room.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs text-gray-500">${room.price}/night</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openForm(room)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => { setRoomToDelete(room); setDeleteDialogOpen(true); }}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Add/Edit Room Form */}
        {formOpen && (
          <form onSubmit={handleSave} className="space-y-3 border-t pt-4 mt-4">
            <Label>Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} disabled={loading} />
            <Label>Price (per night) *</Label>
            <Input value={price} onChange={e => setPrice(e.target.value)} required type="number" min="0" disabled={loading} />
            <Label>Image URLs (comma separated)</Label>
            <Input value={imageUrls} onChange={e => setImageUrls(e.target.value)} disabled={loading} />
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading}>{editingRoom ? 'Save Changes' : 'Add Room'}</Button>
              <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </form>
        )}
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Room</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this room? This action cannot be undone.</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
} 