
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export function TreeManagement() {
  const [trees, setTrees] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTree, setNewTree] = useState({
    name: '',
    type: '',
    description: '',
    status: 'available',
    image_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    const { data } = await supabase
      .from('trees')
      .select('*')
      .order('name');
    
    if (data) {
      setTrees(data);
    }
  };

  const handleAddTree = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('trees')
        .insert(newTree);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tree added successfully',
      });

      setNewTree({
        name: '',
        type: '',
        description: '',
        status: 'available',
        image_url: '',
      });
      setShowAddForm(false);
      fetchTrees();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add tree',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tree Management</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Tree'}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTree} className="border border-[hsl(var(--border-primary))] rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tree Name</Label>
              <Input
                value={newTree.name}
                onChange={(e) => setNewTree({...newTree, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Tree Type</Label>
              <Input
                value={newTree.type}
                onChange={(e) => setNewTree({...newTree, type: e.target.value})}
                placeholder="e.g., Mango, Avocado, Durian"
              />
            </div>
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea
              value={newTree.description}
              onChange={(e) => setNewTree({...newTree, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={newTree.status} onValueChange={(value) => setNewTree({...newTree, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                type="url"
                value={newTree.image_url}
                onChange={(e) => setNewTree({...newTree, image_url: e.target.value})}
              />
            </div>
          </div>
          
          <Button type="submit">Add Tree</Button>
        </form>
      )}
      
      <div className="space-y-4">
        {trees.map((tree) => (
          <div key={tree.id} className="border border-[hsl(var(--border-primary))] rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{tree.name}</h4>
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                  Type: {tree.type || 'Not specified'}
                </p>
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                  Status: <span className="capitalize">{tree.status}</span>
                </p>
                {tree.description && (
                  <p className="text-sm mt-2">{tree.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
