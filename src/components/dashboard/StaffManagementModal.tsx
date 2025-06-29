
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface StaffManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export function StaffManagementModal({ open, onClose }: StaffManagementModalProps) {
  const [staff, setStaff] = useState<any[]>([]);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchStaff();
    }
  }, [open]);

  const fetchStaff = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
    
    if (data) {
      setStaff(data);
    }
  };

  const handleSave = async (staffMember: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: staffMember.full_name,
          role: staffMember.role,
        })
        .eq('id', staffMember.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });

      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update staff member',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Staff member removed successfully',
      });

      fetchStaff();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove staff member',
        variant: 'destructive',
      });
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
            Manage Staff
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-[hsl(var(--text-secondary))]">
            <p style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              Manage your farm team members and their access levels.
            </p>
          </div>

          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="border border-[hsl(var(--border-primary))] rounded-lg p-4">
                {editingStaff?.id === member.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={editingStaff.full_name || ''}
                        onChange={(e) => setEditingStaff({...editingStaff, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Select 
                        value={editingStaff.role} 
                        onValueChange={(value) => setEditingStaff({...editingStaff, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(editingStaff)}>Save</Button>
                      <Button variant="outline" onClick={() => setEditingStaff(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{member.full_name || 'Unnamed User'}</h4>
                      <p className="text-sm text-[hsl(var(--text-secondary))] capitalize">
                        Role: {member.role || 'staff'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingStaff(member)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {staff.length === 0 && (
            <div className="text-center py-8 text-[hsl(var(--text-secondary))]">
              <p style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                No staff members found.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
