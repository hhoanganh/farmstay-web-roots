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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';

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

export function TasksView({ userRole }: TasksViewProps) {
  const { userProfile } = useAuth();
  const {
    tasks,
    loading,
    error,
    refreshTasks,
    updateTaskStatus,
    addTaskUpdate,
  } = useTasks(userRole, userProfile?.id);

  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateModalMode, setUpdateModalMode] = useState<'progress' | 'completion'>('progress');
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    refreshTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, userProfile?.id]);

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
      setDetailTask(task);
      setDetailOpen(true);
    }
  };
  const handleModalSuccess = () => {
    refreshTasks();
  };
  const handleModalDelete = () => {
    refreshTasks();
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

  const renderTaskDetailSheet = () => {
    if (!detailTask) return null;
    const statusOptions = [
      { value: 'To Do', label: 'To Do' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Done', label: 'Done' },
    ];
    const [status, setStatus] = React.useState(detailTask.status);
    const [saving, setSaving] = React.useState(false);
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value;
      setStatus(newStatus);
      setSaving(true);
      await updateTaskStatus(detailTask.id, newStatus);
      setSaving(false);
      refreshTasks();
    };
    return (
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">{detailTask.title}</h3>
            <Button size="sm" onClick={() => {
              setDetailOpen(false);
              setSelectedTask(detailTask);
              setModalMode('edit');
              setModalOpen(true);
            }}>
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
          <p className="text-sm text-gray-500">{detailTask.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Assignee</p>
              <p>{detailTask.assigned_to_profile?.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Priority</p>
              <p>{detailTask.priority || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Due Date</p>
              <p>{detailTask.due_date ? new Date(detailTask.due_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Created By</p>
              <p>{detailTask.created_by_profile?.full_name || 'N/A'}</p>
            </div>
            {(detailTask.room || detailTask.tree) && (
              <div className="col-span-2">
                <p className="font-medium">Related To</p>
                <p>{detailTask.room?.name || detailTask.tree?.name}</p>
              </div>
            )}
          </div>
          <hr />
          {renderTaskUpdates(detailTask)}
          {detailTask.completion_notes && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <h5 className="font-semibold mb-2">Completion Notes</h5>
              <p className="text-sm">{detailTask.completion_notes}</p>
              {detailTask.completion_image_urls && detailTask.completion_image_urls.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {detailTask.completion_image_urls.map((url, index) => (
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

  const renderStaffView = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--text-accent))] mx-auto mb-4"></div>
          <p className="text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Loading your tasks...
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <Card className="border-[hsl(var(--border-primary))]">
          <CardContent className="p-8 text-center">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
            <h3 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
              No tasks assigned
            </h3>
            <p className="text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              You don't have any tasks assigned to you at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="border-[hsl(var(--border-primary))]">
            <CardHeader onClick={() => handleCardClick(task)} className={userRole === 'admin' ? 'cursor-pointer' : ''}>
              <div className="flex items-center justify-between">
                <CardTitle 
                  className="text-[hsl(var(--text-primary))] flex items-center gap-2"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  {getStatusIcon(task.status)}
                  {task.title}
                </CardTitle>
                <div className="flex gap-2">
                  {task.priority && (
                    <Badge variant="outline">
                      {task.priority}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {task.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p 
                className="text-[hsl(var(--text-secondary))] mb-4"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {task.description}
              </p>
              
              {/* Show related room or tree if available */}
              {(task.room || task.tree) && (
                <div className="mb-4 p-3 bg-[hsl(var(--background-secondary))] rounded-md">
                  <p className="text-sm text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    <strong>Related:</strong> {task.room?.name || task.tree?.name}
                  </p>
                </div>
              )}

              {/* Render task updates */}
              {renderTaskUpdates(task)}
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col gap-1">
                  {task.due_date && (
                    <span 
                      className="text-sm text-[hsl(var(--text-secondary))]"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  {task.created_by_profile && (
                    <span 
                      className="text-xs text-[hsl(var(--text-secondary))]"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      Created by: {task.created_by_profile.full_name}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {task.status.toLowerCase() !== 'done' && task.status.toLowerCase() !== 'completed' && (
                    <>
                      <Button 
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => {
                          // Open progress update modal
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
                          // Open completion modal
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
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderAdminView = () => {
    const statusGroups = [
      { label: 'To Do', icon: <Clock className="h-5 w-5" />, match: (s: string) => s === 'to do' || s === 'todo' },
      { label: 'In Progress', icon: <AlertCircle className="h-5 w-5" />, match: (s: string) => s === 'in progress' || s === 'in_progress' },
      { label: 'Done', icon: <CheckCircle className="h-5 w-5" />, match: (s: string) => s === 'done' || s === 'completed' },
    ];
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
      <div className="space-y-8">
        {statusGroups.map(group => {
          const groupTasks = tasks.filter(t => group.match(t.status.toLowerCase()));
          return (
            <div key={group.label}>
              <h3
                className="text-lg font-medium text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                {group.icon}
                {group.label} ({groupTasks.length})
              </h3>
              <div className="space-y-3">
                {groupTasks.map((task) => (
                  <div key={task.id} onClick={() => handleCardClick(task)} className="cursor-pointer">
                    <TaskCard task={task} />
                  </div>
                ))}
                {groupTasks.length === 0 && (
                  <div className="text-sm text-gray-500">No tasks in this category.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
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

      {/* Task Detail Sheet for Admin */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        {renderTaskDetailSheet()}
      </Sheet>
    </div>
  );
}
