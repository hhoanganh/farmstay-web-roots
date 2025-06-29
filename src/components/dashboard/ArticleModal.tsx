
import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';

interface ArticleModalProps {
  open: boolean;
  onClose: () => void;
}

export function ArticleModal({ open, onClose }: ArticleModalProps) {
  const { session } = useAuthSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = generateSlug(title);
      
      const { error } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          slug,
          image_url: imageUrl || null,
          author_id: session?.user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Article published successfully',
      });

      // Reset form
      setTitle('');
      setContent('');
      setImageUrl('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish article',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle 
            className="text-[hsl(var(--text-accent))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Publish Journal Entry
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter article title..."
            />
          </div>

          <div>
            <Label htmlFor="image">Featured Image URL (optional)</Label>
            <Input
              id="image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your article content here..."
              rows={12}
              className="font-mono"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Publishing...' : 'Publish Article'}
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
