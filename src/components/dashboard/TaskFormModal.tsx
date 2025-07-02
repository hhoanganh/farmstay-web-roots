import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/providers/AuthProvider';
import { useProfiles } from '@/hooks/useProfiles';
import { useRooms } from '@/hooks/useRooms';
import { useTrees } from '@/hooks/useTrees';

type TaskFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onDelete?: () => void;
  task?: any;
  mode: 'create' | 'edit';
};

export function TaskFormModal({ open, onOpenChange, onSuccess, task, mode }: TaskFormModalProps) {
  const { toast } = useToast();
  const { profiles, loading: profilesLoading, error: profilesError } = useProfiles();
  const { rooms, loading: roomsLoading, error: roomsError } = useRooms();
  const { trees, loading: treesLoading, error: treesError } = useTrees();
  const { userProfile } = useAuth();

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    due_date: task?.due_date || '',
    assigned_to: task?.assigned_to || '',
    room_id: task?.room_id || '',
    tree_id: task?.tree_id || '',
    evidence_required: task?.evidence_required || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      if (name === 'room_id') {
        return { ...prev, room_id: value, tree_id: '' };
      }
      if (name === 'tree_id') {
        return { ...prev, tree_id: value, room_id: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Only keep the selected (room or tree), set the other to null/empty
    const submitData = {
      ...formData,
      room_id: formData.room_id || null,
      tree_id: formData.tree_id || null,
    };
    if (submitData.room_id) submitData.tree_id = null;
    if (submitData.tree_id) submitData.room_id = null;
    
    try {
      // Mock submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Task ${mode === 'create' ? 'created' : 'updated'} successfully`,
        variant: "default",
      });
      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: "Error",
        description: `Failed to ${mode} task`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      assigned_to: '',
      room_id: '',
      tree_id: '',
      evidence_required: false
    });
  };

  const handleQuickAssign = (profileId: string) => {
    setFormData(prev => ({ ...prev, assigned_to: profileId }));
    toast({
      title: "Assigned",
      description: "Task assigned successfully",
      variant: "default",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</DialogTitle>
          <DialogDescription>
            {userProfile?.role === 'admin'
              ? `${mode === 'create' ? 'Create a new task' : 'Edit the task'} for your staff.`
              : `${mode === 'create' ? 'Create a new task' : 'Edit the task'} for yourself.`
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room_id" className="text-right">
              Room
            </Label>
            <Select onValueChange={(value) => handleSelectChange('room_id', value)} value={formData.room_id}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {roomsLoading ? (
                  <SelectItem value="" disabled>Loading...</SelectItem>
                ) : roomsError ? (
                  <SelectItem value="" disabled>Error</SelectItem>
                ) : (
                  rooms?.map(room => (
                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tree_id" className="text-right">
              Tree
            </Label>
            <Select onValueChange={(value) => handleSelectChange('tree_id', value)} value={formData.tree_id}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select tree" />
              </SelectTrigger>
              <SelectContent>
                {treesLoading ? (
                  <SelectItem value="" disabled>Loading...</SelectItem>
                ) : treesError ? (
                  <SelectItem value="" disabled>Error</SelectItem>
                ) : (
                  trees?.map(tree => (
                    <SelectItem key={tree.id} value={tree.id}>{tree.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select onValueChange={(value) => handleSelectChange('priority', value)} defaultValue={formData.priority === 'medium' ? 'low' : formData.priority}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due_date" className="text-right">
              Due Date
            </Label>
            <Input type="date" id="due_date" name="due_date" value={formData.due_date} onChange={handleChange} className="col-span-3" />
          </div>
          {userProfile?.role === 'admin' ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assigned_to" className="text-right">
                Assign to
              </Label>
              <Select onValueChange={(value) => handleSelectChange('assigned_to', value)} value={formData.assigned_to}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {profilesLoading ? (
                    <SelectItem value="" disabled>Loading...</SelectItem>
                  ) : profilesError ? (
                    <SelectItem value="" disabled>Error</SelectItem>
                  ) : (
                    profiles?.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>{profile.full_name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assigned_to" className="text-right">
                Assign to
              </Label>
              <Input
                type="text"
                id="assigned_to"
                name="assigned_to"
                value={userProfile?.full_name || ''}
                disabled
                className="col-span-3 bg-gray-100"
              />
            </div>
          )}
          <div className="flex justify-end">
            <Button type="submit">{mode === 'create' ? 'Create Task' : 'Update Task'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
