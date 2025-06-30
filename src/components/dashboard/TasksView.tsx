
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TasksViewProps {
  userRole: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigned_to: string;
  created_at: string;
  due_date: string;
}

export function TasksView({ userRole }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Clean Coffee Loft',
        description: 'Deep cleaning of the coffee loft room before next guest',
        status: 'todo',
        priority: 'high',
        assigned_to: 'staff',
        created_at: '2024-01-15T09:00:00Z',
        due_date: '2024-01-16T15:00:00Z',
      },
      {
        id: '2',
        title: 'Update Mango Tree Journal',
        description: 'Post weekly update with photos for the community mango tree',
        status: 'in_progress',
        priority: 'medium',
        assigned_to: 'staff',
        created_at: '2024-01-14T10:00:00Z',
        due_date: '2024-01-17T12:00:00Z',
      },
      {
        id: '3',
        title: 'Inventory Check',
        description: 'Monthly inventory check for farm supplies',
        status: 'done',
        priority: 'low',
        assigned_to: 'staff',
        created_at: '2024-01-10T08:00:00Z',
        due_date: '2024-01-15T17:00:00Z',
      },
    ];
    setTasks(mockTasks);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const renderStaffView = () => (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="border-[hsl(var(--border-primary))]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle 
                className="text-[hsl(var(--text-primary))] flex items-center gap-2"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                {getStatusIcon(task.status)}
                {task.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(task.priority)} variant="outline">
                  {task.priority}
                </Badge>
                <Badge className={getStatusColor(task.status)} variant="outline">
                  {task.status.replace('_', ' ')}
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
            <div className="flex justify-between items-center">
              <span 
                className="text-sm text-[hsl(var(--text-secondary))]"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                {task.status === 'todo' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-[hsl(var(--border-primary))]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Start Task
                  </Button>
                )}
                {task.status === 'in_progress' && (
                  <Button 
                    size="sm"
                    className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAdminView = () => {
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const doneTasks = tasks.filter(t => t.status === 'done');

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
              <Card key={task.id} className="border-[hsl(var(--border-primary))]">
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
                  <div className="flex justify-between items-center">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
                    <span 
                      className="text-xs text-[hsl(var(--text-secondary))]"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
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
              <Card key={task.id} className="border-[hsl(var(--border-primary))]">
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
                  <div className="flex justify-between items-center">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
                    <span 
                      className="text-xs text-[hsl(var(--text-secondary))]"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
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
              <Card key={task.id} className="border-[hsl(var(--border-primary))] opacity-75">
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
                  <div className="flex justify-between items-center">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
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
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        )}
      </div>

      {/* Content */}
      {userRole === 'admin' ? renderAdminView() : renderStaffView()}
    </div>
  );
}
