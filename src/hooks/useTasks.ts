import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type TaskUpdate = {
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

export type Task = Tables<'tasks'> & {
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

export function useTasks(userRole: string, userProfileId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_profile:profiles!tasks_assigned_to_fkey(full_name),
        created_by_profile:profiles!tasks_created_by_fkey(full_name),
        room:rooms!tasks_room_id_fkey(name),
        tree:trees!tasks_tree_id_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (userRole === 'staff' && userProfileId) {
      query = query.eq('assigned_to', userProfileId);
    }

    const { data, error } = await query;
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setTasks((data || []).map(task => ({
      ...task,
      updates: [],
      evidence_required: true // Default value
    })) as Task[]);

    // Fetch updates for each task
    const updatePromises = (data || []).map(async (task) => {
      const { data: updates } = await supabase
        .from('task_updates')
        .select(`*, created_by_profile:profiles(full_name)`)
        .eq('task_id', task.id)
        .order('created_at', { ascending: true });
      return { taskId: task.id, updates: updates || [] };
    });
    const updateResults = await Promise.all(updatePromises);
    setTasks(currentTasks =>
      currentTasks.map(task => {
        const taskUpdates = updateResults.find(r => r.taskId === task.id);
        return {
          ...task,
          updates: taskUpdates?.updates || []
        };
      })
    );
    setLoading(false);
  }, [userRole, userProfileId]);

  const updateTaskStatus = useCallback(async (taskId: string, newStatus: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);
    if (error) setError(error);
    await fetchTasks();
    setLoading(false);
  }, [fetchTasks]);

  const addTaskUpdate = useCallback(
    async (taskId: string, updateType: 'progress' | 'completion', notes: string, imageUrls: string[]) => {
      setLoading(true);
      const { error: updateError } = await supabase
        .from('task_updates')
        .insert({
          task_id: taskId,
          notes,
          image_urls: imageUrls,
          update_type: updateType
        } as any);
      if (updateError) {
        setError(updateError);
        setLoading(false);
        return;
      }
      if (updateType === 'completion') {
        const { error: taskError } = await supabase
          .from('tasks')
          .update({
            status: 'Done',
            completion_notes: notes,
            completion_image_urls: imageUrls
          } as any)
          .eq('id', taskId);
        if (taskError) setError(taskError);
      }
      await fetchTasks();
      setLoading(false);
    },
    [fetchTasks]
  );

  // Initial fetch
  // (Leave to the component to call fetchTasks in useEffect for full control)

  return {
    tasks,
    loading,
    error,
    refreshTasks: fetchTasks,
    updateTaskStatus,
    addTaskUpdate,
  };
} 