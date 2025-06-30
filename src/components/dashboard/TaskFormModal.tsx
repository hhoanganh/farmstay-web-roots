import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  task: Tables<'tasks'> | null;
  onSuccess: (task: Tables<'tasks'>) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskFormModal({ open, onOpenChange, mode, task, onSuccess, onDelete }: TaskFormModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [roomId, setRoomId] = useState<string>('');
  const [treeId, setTreeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<{ id: string; full_name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [trees, setTrees] = useState<{ id: string; name: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setDataLoading(true);
      Promise.all([fetchStaff(), fetchRooms(), fetchTrees()]).then(() => setDataLoading(false));
      if (mode === 'edit' && task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setAssignedTo(task.assigned_to || '');
        setDueDate(task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : '');
        setPriority((task.priority as string) || 'medium');
        setRoomId(task.room_id || '');
        setTreeId(task.tree_id || '');
      } else {
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setDueDate('');
        setPriority('medium');
        setRoomId('');
        setTreeId('');
      }
    }
  }, [open, mode, task]);

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('role', ['staff']);
    if (!error && data) setStaff(data);
  };
  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('id, name');
    if (!error && data) setRooms(data);
  };
  const fetchTrees = async () => {
    const { data, error } = await supabase
      .from('trees')
      .select('id, name');
    if (!error && data) setTrees(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!title || !assignedTo) {
      toast({ title: 'Title and Assignee are required', variant: 'destructive' });
      setLoading(false);
      return;
    }
    const payload = {
      title,
      description,
      assigned_to: assignedTo,
      due_date: dueDate || null,
      priority,
      room_id: roomId || null,
      tree_id: treeId || null,
    };
    let result;
    if (mode === 'create') {
      result = await supabase.from('tasks').insert([payload]).select().single();
    } else if (mode === 'edit' && task) {
      result = await supabase.from('tasks').update(payload).eq('id', task.id).select().single();
    }
    setLoading(false);
    if (result?.error) {
      toast({ title: 'Failed to save task', description: result.error.message, variant: 'destructive' });
    } else if (result?.data) {
      toast({ title: 'Task saved', variant: 'success' });
      onSuccess(result.data);
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setLoading(true);
    const { error } = await supabase.from('tasks').delete().eq('id', task.id);
    setLoading(false);
    if (error) {
      toast({ title: 'Failed to delete task', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Task deleted', variant: 'success' });
      if (onDelete) onDelete(task.id);
      onOpenChange(false);
    }
  };

  if (dataLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--text-accent))] mx-auto mb-4"></div>
            <div className="text-[hsl(var(--text-secondary))]">Loading...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[hsl(var(--text-primary))]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Related Room (optional)
            </label>
            <Select value={roomId} onValueChange={val => {
              setRoomId(val === 'none' ? '' : val);
              if (val !== 'none') setTreeId('none'); // Reset tree if room is selected
            }} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {rooms.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[hsl(var(--text-primary))]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Related Tree (optional)
            </label>
            <Select value={treeId} onValueChange={val => {
              setTreeId(val === 'none' ? '' : val);
              if (val !== 'none') setRoomId('none'); // Reset room if tree is selected
            }} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {trees.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-[hsl(var(--text-secondary))] mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            A task can only be assigned to a room or a tree, not both.
          </div>
          <Input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />
          <Select value={assignedTo} onValueChange={setAssignedTo} disabled={loading} required>
            <SelectTrigger>
              <SelectValue placeholder="Assign to staff" />
            </SelectTrigger>
            <SelectContent>
              {staff.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            disabled={loading}
          />
          <Select value={priority} onValueChange={setPriority} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            {mode === 'edit' && onDelete && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                Delete Task
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {mode === 'create' ? 'Create Task' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 