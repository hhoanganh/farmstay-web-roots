
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
}

export function TreeUpdateModal({ open, onClose }: TreeUpdateModalProps) {
  const [trees, setTrees] = useState<any[]>([]);
  const [selectedTree, setSelectedTree] = useState('');
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchTrees();
    }
  }, [open]);

  const fetchTrees = async () => {
    const { data } = await supabase
      .from('trees')
      .select('*')
      .order('name');
    
    if (data) {
      setTrees(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tree_updates')
        .insert({
          tree_id: selectedTree,
          activity,
          notes,
          image_url: imageUrl || null,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tree update posted successfully',
      });

      // Reset form
      setSelectedTree('');
      setActivity('');
      setNotes('');
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
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
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
