
import React from 'react';
import { AdminDataTable } from './AdminDataTable';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author_id: string;
  created_at: string;
}

const columns = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (info: any) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: (info: any) => info.getValue() || 'Unknown',
    enableSorting: true,
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: (info: any) => {
      const date = info.getValue();
      return date ? new Date(date).toLocaleDateString() : '-';
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info: any) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Published
      </span>
    ),
    enableSorting: false,
  },
];

export default function JournalView() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch articles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Article deleted successfully',
      });

      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    }
  };

  const rowActions = (article: Article) => (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleDeleteArticle(article.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-[hsl(var(--text-secondary))]">Loading articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
            Journal
          </h1>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Manage farm stories and journal entries
          </p>
        </div>
        <Button 
          className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90 h-12"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Publish New Article
        </Button>
      </div>

      {/* Articles List */}
      <AdminDataTable
        columns={columns}
        data={articles}
        rowActions={rowActions}
        filterable
        pagination
      />
    </div>
  );
}
