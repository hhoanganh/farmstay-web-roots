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

interface TreeManagementModalProps {
  open: boolean;
  onClose: () => void;
  refreshTrees: () => void;
}

interface Tree {
  id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  image_url: string;
}

export function TreeManagementModal({ open, onClose, refreshTrees }: TreeManagementModalProps) {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTree, setEditingTree] = useState<Tree | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('available');
  const [imageUrl, setImageUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [treeToDelete, setTreeToDelete] = useState<Tree | null>(null);
  const [selectedTreeId, setSelectedTreeId] = useState<string>('');
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (open) fetchTrees();
    setSelectedTreeId('');
    closeForm();
  }, [open]);

  const fetchTrees = async () => {
    setLoading(true);
    const { data } = await supabase.from('trees').select('*').order('name');
    setTrees(data || []);
    setLoading(false);
  };

  const openForm = (tree?: Tree) => {
    setEditingTree(tree || null);
    setName(tree?.name || '');
    setType(tree?.type || '');
    setDescription(tree?.description || '');
    setStatus(tree?.status || 'available');
    setImageUrl(tree?.image_url || '');
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingTree(null);
    setName('');
    setType('');
    setDescription('');
    setStatus('available');
    setImageUrl('');
    setFormOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: 'Name is required.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const payload = {
      name,
      type,
      description,
      status,
      image_url: imageUrl,
    };
    let error;
    if (editingTree) {
      ({ error } = await supabase.from('trees').update(payload).eq('id', editingTree.id));
    } else {
      ({ error } = await supabase.from('trees').insert(payload));
    }
    setLoading(false);
    if (error) {
      toast({ title: 'Failed to save tree', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Tree saved' });
      closeForm();
      fetchTrees();
      refreshTrees();
    }
  };

  const handleDelete = async () => {
    if (!treeToDelete) return;
    setLoading(true);
    const { error } = await supabase.from('trees').delete().eq('id', treeToDelete.id);
    setLoading(false);
    setDeleteDialogOpen(false);
    setTreeToDelete(null);
    if (error) {
      toast({ title: 'Failed to delete tree', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Tree deleted' });
      fetchTrees();
      refreshTrees();
    }
  };

  const selectedTree = trees.find(t => t.id === selectedTreeId) || null;

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from('tree-images').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setUploadError('Failed to upload image.');
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('tree-images').getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Manage Trees</DialogTitle>
          <DialogDescription>Manage trees for the farm.</DialogDescription>
        </DialogHeader>
        <div className="mb-4 space-y-4">
          <Button onClick={() => openForm()} className="w-full">+ Add Tree</Button>
          <div>
            <Label>Select Tree to Edit</Label>
            <Select value={selectedTreeId} onValueChange={setSelectedTreeId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tree" />
              </SelectTrigger>
              <SelectContent>
                {trees.map(tree => (
                  <SelectItem key={tree.id} value={tree.id}>{tree.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Edit Tree Form */}
        {selectedTree && !formOpen && (
          <form onSubmit={e => { e.preventDefault(); openForm(selectedTree); }} className="space-y-3 border-t pt-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={selectedTree.name} disabled className="w-full" />
              <Label>Type</Label>
              <Input value={selectedTree.type} disabled className="w-full" />
              <Label>Description</Label>
              <Input value={selectedTree.description} disabled className="w-full" />
              <Label>Status</Label>
              <Input value={selectedTree.status} disabled className="w-full" />
              <Label>Image URL</Label>
              <Input value={selectedTree.image_url} disabled className="w-full" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="w-full">Edit</Button>
              <Button type="button" variant="destructive" className="w-full" onClick={() => { setTreeToDelete(selectedTree); setDeleteDialogOpen(true); }}>Delete</Button>
            </div>
          </form>
        )}
        {/* Add/Edit Tree Form */}
        {formOpen && (
          <form onSubmit={handleSave} className="space-y-3 border-t pt-4 mt-4">
            <Label>Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required disabled={loading} className="w-full" />
            <Label>Type</Label>
            <Input value={type} onChange={e => setType(e.target.value)} disabled={loading} className="w-full" />
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} disabled={loading} className="w-full" />
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading || uploading} />
            {uploading && <div className="text-sm text-blue-600">Uploading...</div>}
            {uploadError && <div className="text-sm text-red-600">{uploadError}</div>}
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Tree" className="w-full max-h-40 object-contain rounded" />
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading} className="w-full">{editingTree ? 'Save Changes' : 'Add Tree'}</Button>
              <Button type="button" variant="outline" onClick={closeForm} className="w-full">Cancel</Button>
            </div>
          </form>
        )}
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Tree</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this tree? This action cannot be undone.</div>
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