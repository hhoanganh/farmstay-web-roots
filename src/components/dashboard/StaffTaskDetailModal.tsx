
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { AdminDataTable } from './AdminDataTable';

interface TaskWithProfile extends Tables<'tasks'> {
  assigned_to_profile?: {
    full_name: string;
  };
}

interface StaffTaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskWithProfile & { updates?: any[] };
  onChange: () => void;
}

const statusOptions = [
  { value: 'To Do', label: 'To Do' },
  { value: 'Doing', label: 'Doing' },
  { value: 'Done', label: 'Done' },
];

const columns = [
  {
    accessorKey: 'task',
    header: 'Task',
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
    accessorKey: 'assigned',
    header: 'Assigned',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'due',
    header: 'Due Date',
    cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-',
    enableSorting: true,
  },
];

export const StaffTaskDetailModal: React.FC<StaffTaskDetailModalProps> = ({ open, onOpenChange, task, onChange }) => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(task.status);
  const [imageUrls, setImageUrls] = useState<string[]>(task.completion_image_urls || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setNote('');
      setStatus(task.status);
      setImageUrls(task.completion_image_urls || []);
    }
  }, [task]);

  // Auto-save status
  useEffect(() => {
    if (task && status && status !== task.status) {
      setSaving(true);
      supabase.from('tasks').update({ status }).eq('id', task.id).then(() => {
        setSaving(false);
        onChange();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Auto-save note
  useEffect(() => {
    if (task && note.trim().length > 0) {
      const timeout = setTimeout(() => {
        setSaving(true);
        supabase.from('task_updates').insert({
          task_id: task.id,
          notes: note,
          update_type: 'progress',
        }).then(() => {
          setSaving(false);
          onChange();
        });
      }, 800);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  // Auto-save image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    // For demo: just use local URL. In production, upload to storage and get public URL.
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(prev => [...prev, ...urls]);
    // Save to DB (simulate as completion update)
    await supabase.from('task_updates').insert({
      task_id: task.id,
      image_urls: urls,
      update_type: 'progress',
    });
    setUploading(false);
    onChange();
  };

  // Swipe-to-close (mobile)
  const sheetContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sheetContentRef.current;
    if (!el) return;
    let startX = 0;
    let currentX = 0;
    let touching = false;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touching = true;
        startX = e.touches[0].clientX;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touching) return;
      currentX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      if (touching && currentX - startX > 80) {
        onOpenChange(false);
      }
      touching = false;
      startX = 0;
      currentX = 0;
    };
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onOpenChange]);

  // Transform staffTasks as needed to match column keys
  const data = [
    {
      task: task.title,
      status: task.status,
      assigned: task.assigned_to_profile?.full_name || '-',
      due: task.due_date,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent ref={sheetContentRef} className="w-full max-w-md mx-auto p-6">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge>{status}</Badge>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {saving && <span className="text-xs text-[hsl(var(--stone))] ml-2">Saving...</span>}
          </div>
          <Textarea
            placeholder="Add a note..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="min-h-[80px]"
          />
          <div>
            <input
              ref={fileInputRef}
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
                    className="rounded-md w-full h-24 object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="overflow-x-auto rounded-lg border border-[hsl(var(--border-primary))] bg-[hsl(var(--background-primary))]">
            <AdminDataTable
              columns={columns}
              data={data}
              filterable
              pagination
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 
