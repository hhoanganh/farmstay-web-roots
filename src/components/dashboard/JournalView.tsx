import React from 'react';
import { AdminDataTable } from './AdminDataTable';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

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
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-',
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => info.getValue(),
    enableSorting: true,
  },
];

export default function JournalView() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (!error) {
        setArticles(articles.filter(article => article.id !== id));
      }
    }
  };

  // Transform articles as needed to match column keys
  const data = articles.map(article => ({
    title: article.title,
    author: article.author_id || '-',
    date: article.created_at,
    status: 'Published',
    // ...add other fields as needed
  }));

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
