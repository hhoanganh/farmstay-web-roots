import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) fetchRooms();
    setSelectedRoomId('');
    closeForm();
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

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Rooms</DialogTitle>
        </DialogHeader>
        <div className="mb-4 space-y-4">
          <Button onClick={() => openForm()} className="w-full">+ Add Room</Button>
          <div>
            <Label>Select Room to Edit</Label>
            <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Edit Room Form */}
        {selectedRoom && !formOpen && (
          <form onSubmit={e => { e.preventDefault(); openForm(selectedRoom); }} className="space-y-3 border-t pt-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={selectedRoom.name} disabled className="w-full" />
              <Label>Description</Label>
              <Input value={selectedRoom.description} disabled className="w-full" />
              <Label>Price (per night)</Label>
              <Input value={selectedRoom.price} disabled className="w-full" />
              <Label>Image URLs</Label>
              <Input value={selectedRoom.image_urls?.join(', ')} disabled className="w-full" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="w-full">Edit</Button>
              <Button type="button" variant="destructive" className="w-full" onClick={() => { setRoomToDelete(selectedRoom); setDeleteDialogOpen(true); }}>Delete</Button>
            </div>
          </form>
        )}
        {/* Add/Edit Room Form */}
        {formOpen && (
          <form onSubmit={handleSave} className="space-y-3 border-t pt-4 mt-4">
            <Label>Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required disabled={loading} className="w-full" />
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} disabled={loading} className="w-full" />
            <Label>Price (per night) *</Label>
            <Input value={price} onChange={e => setPrice(e.target.value)} required type="number" min="0" disabled={loading} className="w-full" />
            <Label>Image URLs (comma separated)</Label>
            <Input value={imageUrls} onChange={e => setImageUrls(e.target.value)} disabled={loading} className="w-full" />
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading} className="w-full">{editingRoom ? 'Save Changes' : 'Add Room'}</Button>
              <Button type="button" variant="outline" onClick={closeForm} className="w-full">Cancel</Button>
            </div>
          </form>
        )}
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Room</DialogTitle>
              <DialogDescription>Manage rooms for the homestay.</DialogDescription>
            </DialogHeader>
            <div>Are you sure you want to delete this room? This action cannot be undone.</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full">Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} className="w-full">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
} 