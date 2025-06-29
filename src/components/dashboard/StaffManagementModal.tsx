// ABOUTME: This component provides a modal for managing staff members.
// ABOUTME: It allows admins to add, edit, and remove staff profiles.
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ email: '', full_name: '', role: 'staff' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchStaff();
      setShowAddForm(false);
      setEditingStaff(null);
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
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) {
      return;
    }

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // IMPORTANT: This is a placeholder. Securely inviting a user requires a Supabase Edge Function
      // to call `supabase.auth.admin.inviteUserByEmail()`.
      // The client-side code would then call `supabase.functions.invoke('invite-staff', { body: newStaff })`
      console.log('Attempting to invite new staff:', newStaff);
      toast({
        title: 'Action Required',
        description: 'Staff invitation requires a secure server-side function to be implemented.',
      });

      setShowAddForm(false);
      setNewStaff({ email: '', full_name: '', role: 'staff' });
    } catch (error) {
      // Handle error from edge function call
    } finally {
      setIsSubmitting(false);
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

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-[hsl(var(--text-secondary))]">
            <p style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              Manage your farm team members.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isSubmitting}
          >
            {showAddForm ? 'Cancel' : 'Add New Staff'}
          </Button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddStaff} className="border border-[hsl(var(--border-primary))] rounded-lg p-4 mt-4 space-y-4 bg-[hsl(var(--background-secondary))]">
            <h4 className="font-medium">New Staff Member Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-email">Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  required
                  placeholder="staff@example.com"
                />
              </div>
              <div>
                <Label htmlFor="new-name">Full Name</Label>
                <Input
                  id="new-name"
                  value={newStaff.full_name}
                  onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={newStaff.role} onValueChange={(value) => setNewStaff({...newStaff, role: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}</Button>
          </form>
        )}
        
        <div className="space-y-4 mt-6">
          <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
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
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(editingStaff)} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
                      <Button variant="outline" onClick={() => setEditingStaff(null)} disabled={isSubmitting}>Cancel</Button>
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
                      <Button variant="outline" size="sm" onClick={() => setEditingStaff(member)} disabled={isSubmitting}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        disabled={isSubmitting}
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
