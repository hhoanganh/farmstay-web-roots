import React from 'react';
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
import { AdminDataTable } from './AdminDataTable';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'planted',
    header: 'Planted',
    cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-',
    enableSorting: true,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: info => info.getValue(),
  },
];

export default function TreeManagement() {
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

  // Transform trees as needed to match column keys
  const data = trees.map(tree => ({
    name: tree.name,
    type: tree.type,
    status: tree.status,
    planted: tree.planted_at,
    location: tree.location || '-',
    // ...add other fields as needed
  }));

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
