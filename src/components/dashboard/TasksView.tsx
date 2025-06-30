import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, Clock, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Tables } from '@/integrations/supabase/types';
import { TaskFormModal } from './TaskFormModal';
import { TaskUpdateModal } from './TaskUpdateModal';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface TasksViewProps {
  userRole: string;
}

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

const DraggableTaskCard = ({ task, children }: { task: Task; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const DroppableTaskColumn = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="h-full">
      {children}
    </div>
  );
};

export function TasksView({ userRole }: TasksViewProps) {
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateModalMode, setUpdateModalMode] = useState<'progress' | 'completion'>('progress');
  const [sheetTask, setSheetTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [userRole, userProfile?.id]);

  const fetchTasks = async () => {
    setLoading(true);
    
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

    // Staff only sees their assigned tasks
    if (userRole === 'staff' && userProfile?.id) {
      query = query.eq('assigned_to', userProfile.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      // Add empty updates array to each task
      setTasks((data || []).map(task => ({
        ...task,
        updates: [],
        evidence_required: true // Default value
      })) as Task[]);

      // Fetch updates for each task
      const updatePromises = (data || []).map(async (task) => {
        const { data: updates } = await supabase
          .from('task_updates')
          .select(`
            *,
            created_by_profile:profiles(full_name)
          `)
          .eq('task_id', task.id)
          .order('created_at', { ascending: true });

        return { taskId: task.id, updates: updates || [] };
      });

      const updateResults = await Promise.all(updatePromises);

      // Update tasks with their updates
      setTasks(currentTasks => 
        currentTasks.map(task => {
          const taskUpdates = updateResults.find(r => r.taskId === task.id);
          return {
            ...task,
            updates: taskUpdates?.updates || []
          };
        })
      );
    }
    
    setLoading(false);
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    setUpdatingTask(taskId);
    
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
    } else {
      // Refresh tasks after update
      await fetchTasks();
    }
    
    setUpdatingTask(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do':
      case 'todo':
        return <Clock className="h-4 w-4" />;
      case 'in progress':
      case 'in_progress':
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
      case 'in progress':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus.toLowerCase()) {
      case 'to do':
      case 'todo':
        return 'In Progress';
      case 'in progress':
      case 'in_progress':
        return 'Done';
      default:
        return currentStatus;
    }
  };

  // Modal handlers
  const handleCreateClick = () => {
    setModalMode('create');
    setSelectedTask(null);
    setModalOpen(true);
  };
  const handleCardClick = (task: Task) => {
    if (userRole === 'admin') {
      setSheetTask(task);
    }
  };
  const handleModalSuccess = () => {
    fetchTasks();
  };
  const handleModalDelete = () => {
    fetchTasks();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const task = (active.data as any).current.task as Task;
      const newStatus = over.id as string;

      if (task.status.toLowerCase().replace(/ /g, '_') !== newStatus.toLowerCase().replace(/ /g, '_')) {
        // Optimistic UI Update
        const originalTasks = tasks;
        const updatedTasks = tasks.map(t =>
          t.id === task.id ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);
        
        await updateTaskStatus(task.id, newStatus);
      }
    }
  };

  const handleTaskUpdate = async (taskId: string, updateType: 'progress' | 'completion', notes: string, imageUrls: string[]) => {
    const { error: updateError } = await supabase
      .from('task_updates')
      .insert({
        task_id: taskId,
        created_by: userProfile?.id,
        notes,
        image_urls: imageUrls,
        update_type: updateType
      } as any); // Temporary type assertion until Supabase types are updated

    if (updateError) {
      console.error('Error adding task update:', updateError);
      return;
    }

    // If this is a completion update, update the task status
    if (updateType === 'completion') {
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          status: 'Done',
          completion_notes: notes,
          completion_image_urls: imageUrls
        } as any) // Temporary type assertion until Supabase types are updated
        .eq('id', taskId);

      if (taskError) {
        console.error('Error updating task completion:', taskError);
        return;
      }
    }

    // Refresh tasks
    await fetchTasks();
  };

  const renderTaskUpdates = (task: Task) => {
    if (!task.updates?.length) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium">Updates</h4>
        {task.updates.map((update) => (
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

  const renderStaffView = () => {
    const activeTasks = tasks.filter(task => task.status.toLowerCase() !== 'done' && task.status.toLowerCase() !== 'completed');
    const completedTasks = tasks.filter(task => task.status.toLowerCase() === 'done' || task.status.toLowerCase() === 'completed');

    return (
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="space-y-4 pt-4">
            {loading ? (
              <p>Loading tasks...</p>
            ) : (
              activeTasks.length > 0 ? (
                activeTasks.map((task) => (
                  <Card key={task.id} className="border-[hsl(var(--border-primary))]">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="font-semibold text-lg">{task.title}</span>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="ml-2">{task.status}</span>
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {task.status.toLowerCase() !== 'done' && task.status.toLowerCase() !== 'completed' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setUpdateModalMode('progress');
                                  setUpdateModalOpen(true);
                                }}
                              >
                                Add Update
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setUpdateModalMode('completion');
                                  setUpdateModalOpen(true);
                                }}
                              >
                                Complete Task
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      {renderTaskUpdates(task)}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No active tasks assigned.</p>
                </div>
              )
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="space-y-4 pt-4">
            {loading ? (
              <p>Loading tasks...</p>
            ) : (
              completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <Card key={task.id} className="border-[hsl(var(--border-primary))] opacity-80">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="font-semibold text-lg">{task.title}</span>
                         <Badge className={getStatusColor(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="ml-2">{task.status}</span>
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">{task.description}</p>
                      {renderTaskUpdates(task)}
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No completed tasks yet.</p>
                </div>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  const renderTaskSheetContent = () => {
    if (!sheetTask) return null;
    return (
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{sheetTask.title}</h3>
              <Button size="sm" onClick={() => {
                  setSheetTask(null); // Close sheet
                  setSelectedTask(sheetTask);
                  setModalMode('edit');
                  setModalOpen(true);
              }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
              </Button>
            </div>
            <Badge className={getStatusColor(sheetTask.status)}>
              {getStatusIcon(sheetTask.status)}
              <span className="ml-2">{sheetTask.status}</span>
            </Badge>
            <p className="text-sm text-gray-500">{sheetTask.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium">Assignee</p>
                    <p>{sheetTask.assigned_to_profile?.full_name || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-medium">Priority</p>
                    <p>{sheetTask.priority || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-medium">Due Date</p>
                    <p>{sheetTask.due_date ? new Date(sheetTask.due_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                    <p className="font-medium">Created By</p>
                    <p>{sheetTask.created_by_profile?.full_name || 'N/A'}</p>
                </div>
                {(sheetTask.room || sheetTask.tree) && (
                    <div className="col-span-2">
                        <p className="font-medium">Related To</p>
                        <p>{sheetTask.room?.name || sheetTask.tree?.name}</p>
                    </div>
                )}
            </div>
            <hr />
            {renderTaskUpdates(sheetTask)}
            {sheetTask.completion_notes && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <h5 className="font-semibold mb-2">Completion Notes</h5>
                    <p className="text-sm">{sheetTask.completion_notes}</p>
                    {sheetTask.completion_image_urls && sheetTask.completion_image_urls.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {sheetTask.completion_image_urls.map((url, index) => (
                                <img key={index} src={url} alt={`Completion Evidence ${index + 1}`} className="rounded-md w-full h-24 object-cover"/>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
      </SheetContent>
    );
  };

  const renderAdminView = () => {
    const todoTasks = tasks.filter(t => t.status.toLowerCase() === 'to do' || t.status.toLowerCase() === 'todo');
    const inProgressTasks = tasks.filter(t => t.status.toLowerCase() === 'in progress' || t.status.toLowerCase() === 'in_progress');
    const doneTasks = tasks.filter(t => t.status.toLowerCase() === 'done' || t.status.toLowerCase() === 'completed');

    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--text-accent))] mx-auto mb-4"></div>
          <p className="text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Loading tasks...
          </p>
        </div>
      );
    }

    return (
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <DroppableTaskColumn id="To Do">
            <div>
              <h3 
                className="text-lg font-medium text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                <Clock className="h-5 w-5" />
                To Do ({todoTasks.length})
              </h3>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <DraggableTaskCard key={task.id} task={task}>
                    <Card className="border-[hsl(var(--border-primary))] cursor-pointer" onClick={() => handleCardClick(task)}>
                      <CardContent className="p-4">
                        <h4 
                          className="font-medium text-[hsl(var(--text-primary))] mb-2"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {task.title}
                        </h4>
                        <p 
                          className="text-sm text-[hsl(var(--text-secondary))] mb-3"
                          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        >
                          {task.description}
                        </p>
                        
                        {/* Show assignee and related item */}
                        <div className="mb-3 space-y-1">
                          {task.assigned_to_profile && (
                            <p className="text-xs text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                              <strong>Assigned to:</strong> {task.assigned_to_profile.full_name}
                            </p>
                          )}
                          {(task.room || task.tree) && (
                            <p className="text-xs text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                              <strong>Related:</strong> {task.room?.name || task.tree?.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          {task.priority && (
                            <Badge variant="outline">
                              {task.priority}
                            </Badge>
                          )}
                          {task.due_date && (
                            <span 
                              className="text-xs text-[hsl(var(--text-secondary))]"
                              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                            >
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </DraggableTaskCard>
                ))}
              </div>
            </div>
          </DroppableTaskColumn>

          {/* In Progress Column */}
          <DroppableTaskColumn id="In Progress">
            <div>
              <h3 
                className="text-lg font-medium text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                <AlertCircle className="h-5 w-5" />
                In Progress ({inProgressTasks.length})
              </h3>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <DraggableTaskCard key={task.id} task={task}>
                    <Card className="border-[hsl(var(--border-primary))] cursor-pointer" onClick={() => handleCardClick(task)}>
                      <CardContent className="p-4">
                        <h4 
                          className="font-medium text-[hsl(var(--text-primary))] mb-2"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {task.title}
                        </h4>
                        <p 
                          className="text-sm text-[hsl(var(--text-secondary))] mb-3"
                          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        >
                          {task.description}
                        </p>
                        
                        {/* Show assignee and related item */}
                        <div className="mb-3 space-y-1">
                          {task.assigned_to_profile && (
                            <p className="text-xs text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                              <strong>Assigned to:</strong> {task.assigned_to_profile.full_name}
                            </p>
                          )}
                          {(task.room || task.tree) && (
                            <p className="text-xs text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                              <strong>Related:</strong> {task.room?.name || task.tree?.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          {task.priority && (
                            <Badge variant="outline">
                              {task.priority}
                            </Badge>
                          )}
                          {task.due_date && (
                            <span 
                              className="text-xs text-[hsl(var(--text-secondary))]"
                              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                            >
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </DraggableTaskCard>
                ))}
              </div>
            </div>
          </DroppableTaskColumn>

          {/* Done Column */}
          <DroppableTaskColumn id="Done">
            <div>
              <h3 
                className="text-lg font-medium text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                <CheckCircle className="h-5 w-5" />
                Done ({doneTasks.length})
              </h3>
              <div className="space-y-3">
                {doneTasks.map((task) => (
                  <DraggableTaskCard key={task.id} task={task}>
                    <Card className="border-[hsl(var(--border-primary))] opacity-75 cursor-pointer" onClick={() => handleCardClick(task)}>
                      <CardContent className="p-4">
                        <h4 
                          className="font-medium text-[hsl(var(--text-primary))] mb-2"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {task.title}
                        </h4>
                        <p 
                          className="text-sm text-[hsl(var(--text-secondary))] mb-3"
                          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        >
                          {task.description}
                        </p>
                        
                        {/* Show assignee and related item */}
                        <div className="mb-3 space-y-1">
                          {task.assigned_to_profile && (
                            <p className="text-xs text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                              <strong>Assigned to:</strong> {task.assigned_to_profile.full_name}
                            </p>
                          )}
                          {(task.room || task.tree) && (
                            <p className="text-xs text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                              <strong>Related:</strong> {task.room?.name || task.tree?.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          {task.priority && (
                            <Badge variant="outline">
                              {task.priority}
                            </Badge>
                          )}
                          <span 
                            className="text-xs text-[hsl(var(--text-secondary))]"
                            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                          >
                            Completed
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </DraggableTaskCard>
                ))}
              </div>
            </div>
          </DroppableTaskColumn>
        </div>
      </DndContext>
    );
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 
            className="text-4xl text-[hsl(var(--text-accent))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            {userRole === 'admin' ? 'Task Management' : 'My Assigned Tasks'}
          </h1>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {userRole === 'admin' 
              ? 'Manage tasks for all staff members'
              : 'View and update your assigned tasks'
            }
          </p>
        </div>
        {userRole === 'admin' && (
          <Button
            className="bg-[hsl(var(--interactive-primary))] text-[hsl(var(--interactive-primary-foreground))] font-semibold focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring-focus))] h-12"
            style={{ fontFamily: 'Inter, sans-serif' }}
            onClick={handleCreateClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        )}
      </div>

      {/* Content */}
      {userRole === 'admin' ? renderAdminView() : renderStaffView()}

      {/* Task Form Modal */}
      <TaskFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleModalSuccess}
        onDelete={handleModalDelete}
        task={selectedTask}
        mode={modalMode}
      />

      {/* Task Update Modal */}
      <TaskUpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSuccess={handleModalSuccess}
        task={selectedTask!}
        mode={updateModalMode}
      />

      {/* Task Detail Sheet */}
      <Sheet open={!!sheetTask} onOpenChange={(isOpen) => !isOpen && setSheetTask(null)}>
        {renderTaskSheetContent()}
      </Sheet>
    </div>
  );
}
