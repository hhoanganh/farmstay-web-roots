import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface TreeUpdateModalProps {
  open: boolean;
  onClose: () => void;
  treeId?: string;
}

export function TreeUpdateModal({ open, onClose, treeId }: TreeUpdateModalProps) {
  const [trees, setTrees] = useState<any[]>([]);
  const [selectedTree, setSelectedTree] = useState(treeId || '');
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && !treeId) {
      fetchTrees();
    }
    if (treeId) {
      setSelectedTree(treeId);
    }
  }, [open, treeId]);

  const fetchTrees = async () => {
    const { data } = await supabase
      .from('trees')
      .select('*')
      .order('name');
    if (data) {
      setTrees(data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `tree-update-${selectedTree}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('tree-images').upload(filePath, imageFile, { upsert: true });
      if (uploadError) {
        toast({ title: 'Failed to upload image', description: uploadError.message, variant: 'destructive' });
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('tree-images').getPublicUrl(filePath);
      finalImageUrl = data.publicUrl;
    }
    try {
      const { error } = await supabase
        .from('tree_updates')
        .insert({
          tree_id: selectedTree,
          activity,
          notes,
          image_url: finalImageUrl || null,
        });
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Tree update posted successfully',
      });
      setActivity('');
      setNotes('');
      setImageFile(null);
      setImageUrl('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post tree update',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const activityOptions = [
    'Watering',
    'Pruning',
    'Fertilizing',
    'Harvesting',
    'Pest Control',
    'Growth Update',
    'General Care',
    'Other',
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle 
            className="text-[hsl(var(--text-accent))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Post Tree Update
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!treeId && (
            <div>
              <Label htmlFor="tree">Tree</Label>
              <Select value={selectedTree} onValueChange={setSelectedTree} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tree" />
                </SelectTrigger>
                <SelectContent>
                  {trees.map((tree) => (
                    <SelectItem key={tree.id} value={tree.id}>
                      {tree.name} ({tree.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="activity">Activity</Label>
            <Select value={activity} onValueChange={setActivity} required>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this activity..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="image">Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
            {imageFile && (
              <div className="mt-2">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full max-h-40 object-contain rounded" />
              </div>
            )}
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste an image URL"
              className="mt-2"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading || !selectedTree || !activity} className="flex-1">
              {loading ? 'Posting...' : 'Post Update'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
