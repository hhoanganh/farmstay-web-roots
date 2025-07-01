import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  userRole: string;
};

export function TaskFormModal({ isOpen, onClose, onSubmit, userRole }: TaskFormModalProps) {
  const { toast } = useToast();
  const { profiles, loading: profilesLoading, error: profilesError } = useProfiles();
  const { rooms, loading: roomsLoading, error: roomsError } = useRooms();
  const { trees, loading: treesLoading, error: treesError } = useTrees();
  const { userProfile } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    room_id: '',
    tree_id: '',
    evidence_required: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: "Task created successfully",
        variant: "default", // Changed from "success"
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
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
      variant: "default", // Changed from "success"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            {userRole === 'admin'
              ? 'Create a new task for your staff.'
              : 'Create a new task for yourself.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
            <Select onValueChange={(value) => handleSelectChange('priority', value)} defaultValue={formData.priority}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
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
          {userRole === 'admin' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assigned_to" className="text-right">
                  Assign to
                </Label>
                <Select onValueChange={(value) => handleSelectChange('assigned_to', value)}>
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
              {formData.assigned_to && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right"></div>
                  <Button type="button" variant="outline" onClick={() => handleQuickAssign(userProfile?.id || '')} className="col-span-3">
                    Quick Assign to Me
                  </Button>
                </div>
              )}
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room_id" className="text-right">
              Room
            </Label>
            <Select onValueChange={(value) => handleSelectChange('room_id', value)}>
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
            <Select onValueChange={(value) => handleSelectChange('tree_id', value)}>
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
            <Label htmlFor="evidence_required" className="text-right">
              Evidence Required
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch id="evidence_required" name="evidence_required" checked={formData.evidence_required} onCheckedChange={(checked) => handleSwitchChange('evidence_required', checked)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
