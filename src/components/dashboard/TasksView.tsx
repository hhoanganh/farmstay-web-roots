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
import { TaskDetailSheet } from './TaskDetailSheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  // Filter tasks for staff
  let visibleTasks = tasks;
  if (userRole === 'staff' && userProfile?.id) {
    visibleTasks = tasks.filter(task => task.assigned_to === userProfile.id);
  }

  // Tab state for room/tree
  const [tab, setTab] = useState<'room' | 'tree'>('room');

  // Filtered tasks for the selected tab
  const filteredTasks = tab === 'room'
    ? visibleTasks.filter(task => task.room_id)
    : visibleTasks.filter(task => task.tree_id);

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
        return 'Doing';
      case 'doing':
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

  const handleEditClick = (task: Task) => {
    setDetailOpen(false);
    setSelectedTask(task);
    setModalMode('edit');
    setModalOpen(true);
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
      { value: 'Doing', label: 'Doing' },
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

  const renderStaffView = () => {
    const statusGroups = [
      { label: 'To Do', icon: <Clock className="h-5 w-5" />, match: (s: string) => s === 'to do' || s === 'todo' },
      { label: 'Doing', icon: <AlertCircle className="h-5 w-5" />, match: (s: string) => s === 'doing' },
      { label: 'Done', icon: <CheckCircle className="h-5 w-5" />, match: (s: string) => s === 'done' || s === 'completed' },
    ];

    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--text-accent))] mx-auto mb-4"></div>
          <p className="text-[hsl(var(--text-secondary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Loading your tasks...
          </p>
        </div>
      );
    }
    
    if (visibleTasks.length === 0) {
      return (
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
      );
    }

    return (
      <div className="space-y-8">
        {statusGroups.map(group => {
          const groupTasks = visibleTasks.filter(t => group.match(t.status.toLowerCase()));
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
                  <div key={task.id} onClick={() => { setDetailTask(task); setDetailOpen(true); }} className="cursor-pointer">
                    <TaskCard task={task} onStatusChange={refreshTasks} />
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

  const renderAdminView = () => {
    const statusGroups = [
      { label: 'To Do', icon: <Clock className="h-5 w-5" />, match: (s: string) => s === 'to do' || s === 'todo' },
      { label: 'Doing', icon: <AlertCircle className="h-5 w-5" />, match: (s: string) => s === 'doing' },
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
          const groupTasks = visibleTasks.filter(t => group.match(t.status.toLowerCase()));
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
                    <TaskCard task={task} onStatusChange={refreshTasks} />
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
            Tasks
          </h1>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Manage staff tasks and assignments
          </p>
          {/* Mobile-only button below title */}
          <div className="flex gap-2 mt-4 sm:hidden">
            <Button
              className="bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))] font-semibold flex-1"
              style={{ fontFamily: 'Inter, sans-serif' }}
              onClick={handleCreateClick}
            >
              Add New Task
            </Button>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button 
            className="bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))] font-semibold h-12"
            style={{ fontFamily: 'Inter, sans-serif' }}
            onClick={handleCreateClick}
          >
            Add New Task
          </Button>
        </div>
      </div>
      {/* Tabs for Room/Tree Tasks */}
      <Tabs value={tab} onValueChange={v => setTab(v as 'room' | 'tree')} className="mb-6">
        <TabsList className="w-full grid grid-cols-2 max-w-xs">
          <TabsTrigger value="room">Room Tasks</TabsTrigger>
          <TabsTrigger value="tree">Tree Tasks</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Tasks Grid for Selected Tab */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} onClick={() => handleCardClick(task)}>
            <TaskCard task={task} />
          </div>
        ))}
      </div>
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
          <h3 
            className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            No tasks found
          </h3>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            All clear! No tasks to show.
          </p>
        </div>
      )}
      {/* Modals */}
      <TaskFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleModalSuccess}
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
      {detailTask && (
        <TaskDetailSheet
          task={detailTask}
          open={detailOpen}
          userRole={userRole}
          onOpenChange={(open) => { setDetailOpen(open); if (!open) setDetailTask(null); }}
          onEdit={handleEditClick}
          onStatusChange={async (taskId, newStatus) => {
            await updateTaskStatus(taskId, newStatus);
            refreshTasks();
          }}
        />
      )}
    </div>
  );
}
