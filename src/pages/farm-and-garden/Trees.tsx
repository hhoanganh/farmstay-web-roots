import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTrees } from '@/hooks/useTrees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TreePine } from 'lucide-react';

const treeTypeIntros: Record<string, { title: string; intro: string }> = {
  durian: {
    title: 'Durian Trees at LamHa Farmstay',
    intro: 'Uncover the secrets of our prized durian trees. Each tree has its own story, waiting for you to discover and be part of its journey.'
  },
  mango: {
    title: 'Mango Trees at LamHa Farmstay',
    intro: 'Discover the story of our sweet mango trees. Follow their growth and be inspired by their vibrant life on the farm.'
  },
  avocado: {
    title: 'Avocado Trees at LamHa Farmstay',
    intro: 'Follow the journey of our creamy avocado trees. See how they thrive and imagine being part of their story.'
  },
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Trees: React.FC = () => {
  const query = useQuery();
  const type = query.get('type')?.toLowerCase() || '';
  const { trees, loading } = useTrees();

  const filteredTrees = trees.filter(tree => tree.type?.toLowerCase() === type);
  const intro = treeTypeIntros[type] || {
    title: 'Our Trees',
    intro: 'Explore the unique trees at LamHa Farmstay. Each one has a story to tell.'
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--text-accent))] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>{intro.title}</h1>
        <p className="text-lg text-[hsl(var(--text-secondary))] mb-4" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{intro.intro}</p>
        <Button asChild size="lg" className="bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))] font-semibold mt-2">
          <a href="/connect">Contact Us to Rent or Adopt a Tree</a>
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-[hsl(var(--text-secondary))]">Loading trees...</div>
      ) : filteredTrees.length === 0 ? (
        <div className="text-center py-12">
          <TreePine className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
          <h3 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>No trees found</h3>
          <p className="text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            We are growing more trees of this type. Contact us to learn more or check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTrees.map(tree => (
            <Card key={tree.id} className="border-[hsl(var(--border-primary))] hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col items-start">
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-2 w-full">
                    {tree.image_url ? (
                      <img
                        src={tree.image_url}
                        alt={tree.name}
                        className="w-full h-full object-cover rounded-md max-h-40"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start w-full">
                    <CardTitle className="text-[hsl(var(--text-primary))]" style={{ fontFamily: 'Caveat, cursive' }}>{tree.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                      {tree.status || 'Healthy'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-[hsl(var(--text-secondary))] line-clamp-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {tree.description || 'No description available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trees;
