import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

interface TaskUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Tables<'tasks'> & {
    evidence_required?: boolean;
  };
  mode: 'progress' | 'completion';
}

export function TaskUpdateModal({ isOpen, onClose, onSuccess, task, mode }: TaskUpdateModalProps) {
  const [notes, setNotes] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop() || '';
      const filePath = `task-updates/${task.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('task-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('task-media')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
    setImageUrls([...imageUrls, ...urls]);
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    
    setSubmitting(true);
    
    // First, update the task status and evidence
    if (mode === 'completion') {
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          status: 'Done',
          completion_notes: notes,
          completion_image_urls: imageUrls
        })
        .eq('id', task.id);

      if (taskError) {
        console.error('Error updating task completion:', taskError);
        setSubmitting(false);
        return;
      }
    }

    // Then create the task update
    const { error: updateError } = await supabase
      .from('task_updates')
      .insert({
        task_id: task.id,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        notes,
        image_urls: imageUrls,
        update_type: mode
      });

    if (updateError) {
      console.error('Error adding task update:', updateError);
      // If this was a completion update, revert the task status
      if (mode === 'completion') {
        await supabase
          .from('tasks')
          .update({ 
            status: 'Doing',
            completion_notes: null,
            completion_image_urls: null 
          })
          .eq('id', task.id);
      }
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'completion' ? 'Complete Task' : 'Add Progress Update'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder={mode === 'completion' ? 'Add completion notes...' : 'Add progress update...'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="mb-2"
            />
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Update ${index + 1}`}
                    className="rounded-md w-full h-32 object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={submitting || uploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!notes.trim() || submitting || uploading || (mode === 'completion' && task.evidence_required && imageUrls.length === 0)}
            >
              {submitting ? 'Submitting...' : mode === 'completion' ? 'Complete Task' : 'Add Update'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 