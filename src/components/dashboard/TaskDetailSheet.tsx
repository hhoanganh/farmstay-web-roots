import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// These types should ideally be in a shared file, but are here for now to match TasksView
type TaskUpdate = {
  id: string;
  task_id: string;
  created_by: string | null;
  created_at: string;
  notes: string;
  image_urls: string[];
  update_type: 'progress' | 'completion';
  created_by_profile?: {
    full_name: string;
  };
};

type Task = Tables<'tasks'> & {
  assigned_to_profile?: {
    full_name: string;
  };
  created_by_profile?: {
    full_name: string;
  };
  room?: {
    name: string;
  };
  tree?: {
    name: string;
  };
  updates?: TaskUpdate[];
  evidence_required?: boolean;
  completion_notes?: string;
  completion_image_urls?: string[];
  priority?: 'low' | 'medium' | 'high';
};

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  userRole: string;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: string) => Promise<void>;
  onTaskUpdated?: (comment: string, imageUrls: string[]) => Promise<void>;
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do':
      case 'todo':
        return <Clock className="h-4 w-4" />;
      case 'doing':
        return <AlertCircle className="h-4 w-4" />;
      case 'done':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do':
      case 'todo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'doing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const renderTaskUpdates = (updates: TaskUpdate[]) => {
    if (!updates?.length) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium">Updates</h4>
        {updates.map((update) => (
          <div key={update.id} className="bg-[hsl(var(--background-secondary))] p-3 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-[hsl(var(--text-secondary))]">
                {new Date(update.created_at).toLocaleString()}
                {update.created_by_profile?.full_name && ` by ${update.created_by_profile.full_name}`}
              </span>
              <Badge variant={update.update_type === 'completion' ? 'default' : 'secondary'}>
                {update.update_type === 'completion' ? 'Completion' : 'Progress'}
              </Badge>
            </div>
            <p className="text-sm">{update.notes}</p>
            {update.image_urls && update.image_urls.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {update.image_urls.map((url, index) => (
                  <img key={index} src={url} alt={`Update ${index + 1}`} className="rounded-md w-full h-32 object-cover" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
};

export const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({ task, open, userRole, onOpenChange, onEdit, onStatusChange, onTaskUpdated }) => {
    if (!task) return null;

    const statusOptions = [
      { value: 'To Do', label: 'To Do' },
      { value: 'Doing', label: 'Doing' },
      { value: 'Done', label: 'Done' },
    ];

    const [status, setStatus] = React.useState(task.status);
    const [saving, setSaving] = React.useState(false);
    // --- Staff update form state ---
    const [updateComment, setUpdateComment] = React.useState('');
    const [updateImages, setUpdateImages] = React.useState<File[]>([]);
    const [submittingUpdate, setSubmittingUpdate] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    // ---
    const [localUpdates, setLocalUpdates] = React.useState<TaskUpdate[]>(task.updates || []);

    React.useEffect(() => {
        if (task) {
            setStatus(task.status);
            fetchUpdates();
        }
    }, [task]);

    // Fetch latest updates for this task
    const fetchUpdates = async () => {
      const { data, error } = await supabase
        .from('task_updates')
        .select('*, created_by_profile:profiles(full_name)')
        .eq('task_id', task.id)
        .order('created_at', { ascending: true });
      if (!error && data) {
        setLocalUpdates(data as TaskUpdate[]);
      }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value;
      setStatus(newStatus);
      setSaving(true);
      await onStatusChange(task.id, newStatus);
      setSaving(false);
    };

    // --- Staff update form logic ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setUpdateImages(Array.from(e.target.files));
      }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
      if (!updateComment.trim()) {
        setFormError('Comment is required.');
        return;
      }
      setSubmittingUpdate(true);
      let imageUrls: string[] = [];
      if (updateImages.length > 0) {
        // Upload each image to Supabase Storage
        for (const file of updateImages) {
          const fileExt = file.name.split('.').pop();
          const filePath = `task-updates/${task.id}/${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`;
          const { data, error } = await supabase.storage.from('task-media').upload(filePath, file);
          if (error) {
            setFormError('Image upload failed.');
            setSubmittingUpdate(false);
            return;
          }
          const { data: publicUrlData } = supabase.storage.from('task-media').getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) {
            imageUrls.push(publicUrlData.publicUrl);
          }
        }
      }
      // Use parent callback if provided
      if (typeof onTaskUpdated === 'function') {
        await onTaskUpdated(updateComment, imageUrls);
      }
      setUpdateComment('');
      setUpdateImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSubmittingUpdate(false);
      await fetchUpdates(); // Refresh only this task's updates
    };
    // ---

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto" aria-describedby="task-detail-desc">
          <span id="task-detail-desc" className="sr-only">Task details and actions</span>
          <SheetHeader>
            <SheetTitle>Task Details</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <Button size="sm" onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(status)}>
                {getStatusIcon(status)}
                <span className="ml-2">{status}</span>
              </Badge>
              {userRole === 'admin' && (
                <select
                  className="ml-2 border rounded px-2 py-1 text-sm"
                  value={status}
                  onChange={handleStatusChange}
                  disabled={saving}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
              {saving && <span className="ml-2 text-xs text-gray-400">Saving...</span>}
            </div>
            <p className="text-sm text-gray-500">{task.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Assignee</p>
                <p>{task.assigned_to_profile?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Priority</p>
                <p>{task.priority || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Due Date</p>
                <p>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Created By</p>
                <p>{task.created_by_profile?.full_name || 'N/A'}</p>
              </div>
              {(task.room || task.tree) && (
                <div className="col-span-2">
                  <p className="font-medium">Related To</p>
                  <p>{task.room?.name || task.tree?.name}</p>
                </div>
              )}
            </div>
            <hr />
            {renderTaskUpdates(localUpdates)}
            {/* Staff update form */}
            {userRole === 'staff' && (
              <form className="mt-6 space-y-3" onSubmit={handleUpdateSubmit}>
                <h4 className="text-sm font-medium">Add Update</h4>
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  placeholder="Add a comment..."
                  value={updateComment}
                  onChange={e => setUpdateComment(e.target.value)}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="block text-sm"
                />
                <Button type="submit" disabled={submittingUpdate || !updateComment.trim()} className="w-full">
                  {submittingUpdate ? 'Submitting...' : 'Submit Update'}
                </Button>
              </form>
            )}
            {task.completion_notes && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <h5 className="font-semibold mb-2">Completion Notes</h5>
                <p className="text-sm">{task.completion_notes}</p>
                {task.completion_image_urls && task.completion_image_urls.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {task.completion_image_urls.map((url, index) => (
                      <img key={index} src={url} alt={`Completion Evidence ${index + 1}`} className="rounded-md w-full h-24 object-cover"/>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
}; 