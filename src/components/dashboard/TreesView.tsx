import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TreePine, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TreeManagementModal } from './TreeManagementModal';
import { TreeUpdateModal } from './TreeUpdateModal';

interface TreesViewProps {
  userRole: string;
}

interface Tree {
  id: string;
  name: string;
  type?: string;
  description?: string;
  status?: string;
  image_url?: string;
  created_at?: string;
}

export function TreesView({ userRole }: TreesViewProps) {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [treeModalOpen, setTreeModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<any>(null);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    const { data, error } = await supabase
      .from('trees')
      .select('*')
      .order('name');

    if (!error && data) {
      setTrees(data);
    }
  };

  const filteredTrees = trees.filter(tree => {
    const matchesSearch = tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tree.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tree.status === statusFilter;
    const matchesType = typeFilter === 'all' || tree.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-[hsl(var(--green)/0.1)] text-[hsl(var(--green))] border-[hsl(var(--green)/0.2)]';
      case 'rented':
        return 'bg-[hsl(var(--brown)/0.1)] text-[hsl(var(--brown))] border-[hsl(var(--brown)/0.2)]';
      case 'maintenance':
        return 'bg-[hsl(var(--stone)/0.1)] text-[hsl(var(--stone))] border-[hsl(var(--stone)/0.2)]';
      default:
        return 'bg-[hsl(var(--stone)/0.1)] text-[hsl(var(--stone))] border-[hsl(var(--stone)/0.2)]';
    }
  };

  const uniqueTypes = [...new Set(trees.map(tree => tree.type).filter(Boolean))];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 
            className="text-4xl text-[hsl(var(--text-accent))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Trees
          </h1>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Manage tree rentals and life cycle updates
          </p>
          {/* Mobile-only buttons below title */}
          <div className="flex gap-2 mt-4 sm:hidden">
            <Button
              variant="outline"
              onClick={() => setTreeModalOpen(true)}
              className="flex-1"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Manage Trees
            </Button>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          {userRole === 'admin' && (
            <Button
              variant="outline"
              onClick={() => setTreeModalOpen(true)}
              className="h-12"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Manage Trees
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--text-secondary))] h-4 w-4" />
          <Input
            placeholder="Search trees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[hsl(var(--border-primary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 border-[hsl(var(--border-primary))]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 border-[hsl(var(--border-primary))]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trees Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTrees.map((tree) => {
          return (
            <Card key={tree.id} className="border-[hsl(var(--border-primary))] hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedTree(tree);
                setUpdateModalOpen(true);
              }}
            >
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
                    <CardTitle 
                      className="text-[hsl(var(--text-primary))]"
                      style={{ fontFamily: 'Caveat, cursive' }}
                    >
                      {tree.name}
                    </CardTitle>
                    <Badge className={getStatusColor(tree.status || 'unknown')} variant="outline">
                      {tree.status || 'Unknown status'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p 
                    className="text-sm text-[hsl(var(--text-secondary))] line-clamp-2"
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    {tree.description || 'No description available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTrees.length === 0 && (
        <div className="text-center py-12">
          <TreePine className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
          <h3 
            className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            No trees found
          </h3>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Tree Management Modal */}
      <TreeManagementModal
        open={treeModalOpen}
        onClose={() => setTreeModalOpen(false)}
        refreshTrees={fetchTrees}
      />
      {/* Manual Update Modal for selected tree */}
      <TreeUpdateModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        treeId={selectedTree?.id}
      />
    </div>
  );
}
