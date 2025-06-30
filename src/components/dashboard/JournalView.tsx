
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

export function JournalView() {
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

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 
            className="text-4xl text-[hsl(var(--text-accent))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
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
      <div className="space-y-4">
        {articles.length === 0 ? (
          <Card className="border-[hsl(var(--border-primary))]">
            <CardContent className="p-8">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
                <h3 
                  className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  No Articles Yet
                </h3>
                <p 
                  className="text-[hsl(var(--text-secondary))] mb-4"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  Start sharing your farm stories and experiences
                </p>
                <Button 
                  className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Write Your First Article
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="border-[hsl(var(--border-primary))]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 
                        className="text-xl font-medium text-[hsl(var(--text-primary))]"
                        style={{ fontFamily: 'Caveat, cursive' }}
                      >
                        {article.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Published
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-[hsl(var(--text-secondary))] mb-4">
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                        Slug: /{article.slug}
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                        Created: {format(new Date(article.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    
                    <p 
                      className="text-[hsl(var(--text-secondary))] line-clamp-2"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {article.content ? article.content.substring(0, 200) + '...' : 'No content preview available'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--background-primary))]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--background-primary))]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 text-red-600"
                      onClick={() => handleDeleteArticle(article.id)}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
