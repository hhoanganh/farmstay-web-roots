import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Tables } from '@/integrations/supabase/types';
import { TaskFormModal } from './TaskFormModal';

interface TasksViewProps {
  userRole: string;
}

// Use the actual database types
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
      setTasks(data || []);
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
      setModalMode('edit');
      setSelectedTask(task);
      setModalOpen(true);
    }
  };
  const handleModalSuccess = () => {
    fetchTasks();
  };
  const handleModalDelete = () => {
    fetchTasks();
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
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
                  )}
                  <Badge className={getStatusColor(task.status)} variant="outline">
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
              
              <div className="flex justify-between items-center">
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
                    <Button 
                      size="sm"
                      className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskStatus(task.id, getNextStatus(task.status));
                      }}
                      disabled={updatingTask === task.id}
                    >
                      {updatingTask === task.id ? 'Updating...' : 
                       task.status.toLowerCase() === 'to do' || task.status.toLowerCase() === 'todo' 
                         ? 'Start Task' 
                         : 'Mark Complete'
                      }
                    </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
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
              <Card key={task.id} className="border-[hsl(var(--border-primary))] cursor-pointer" onClick={() => handleCardClick(task)}>
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
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
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
            ))}
          </div>
        </div>

        {/* In Progress Column */}
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
              <Card key={task.id} className="border-[hsl(var(--border-primary))] cursor-pointer" onClick={() => handleCardClick(task)}>
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
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
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
            ))}
          </div>
        </div>

        {/* Done Column */}
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
              <Card key={task.id} className="border-[hsl(var(--border-primary))] opacity-75 cursor-pointer" onClick={() => handleCardClick(task)}>
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
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
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
            ))}
          </div>
        </div>
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
            className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90 h-12"
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

      {/* Task Modal (admin only) */}
      {userRole === 'admin' && (
        <TaskFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          task={selectedTask}
          onSuccess={handleModalSuccess}
          onDelete={handleModalDelete}
        />
      )}
    </div>
  );
}
