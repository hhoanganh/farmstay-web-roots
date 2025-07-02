import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/hooks/useTasks';
import { useAuth } from '@/providers/AuthProvider';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
  children?: React.ReactNode;
}

export const TaskCard: React.FC<TaskCardProps & { onStatusChange?: () => void }> = ({ task, children, onStatusChange }) => {
  const { userProfile } = useAuth();
  const { updateTaskStatus } = useTasks(userProfile?.role, userProfile?.id);
  const { toast } = useToast();

  // Determine if the current user is staff and assigned to this task
  const isAssignedStaff = userProfile?.role === 'staff' && task.assigned_to === userProfile.id;

  // Determine next status and button label
  let nextStatus = null;
  let buttonLabel = '';
  if (isAssignedStaff) {
    if (task.status?.toLowerCase() === 'to do' || task.status?.toLowerCase() === 'todo') {
      nextStatus = 'Doing';
      buttonLabel = 'Start';
    } else if (task.status?.toLowerCase() === 'doing') {
      nextStatus = 'Done';
      buttonLabel = 'Complete';
    }
  }

  const handleStatusUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nextStatus) return;
    try {
      await updateTaskStatus(task.id, nextStatus);
      toast({ title: 'Task updated', description: `Status set to ${nextStatus}`, variant: 'default' });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      toast({ title: 'Error', description: 'Could not update task status', variant: 'destructive' });
    }
  };

  return (
    <Card className="border-[hsl(var(--border-primary))] hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex flex-col items-start">
          <div className="flex justify-between items-start w-full mb-2">
            <h4 
              className="font-medium text-[hsl(var(--text-primary))]"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              {task.title}
            </h4>
            <div className="flex gap-2 items-center">
              {task.status && (
                <Badge className={
                  task.status.toLowerCase() === 'to do' || task.status.toLowerCase() === 'todo'
                    ? 'bg-gray-100 text-gray-800 border-gray-200'
                    : task.status.toLowerCase() === 'doing'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : task.status.toLowerCase() === 'done' || task.status.toLowerCase() === 'completed'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                } variant="outline">
                  {task.status.toLowerCase() === 'to do' || task.status.toLowerCase() === 'todo'
                    ? 'New'
                    : task.status.toLowerCase() === 'doing'
                    ? 'Doing'
                    : task.status.toLowerCase() === 'done' || task.status.toLowerCase() === 'completed'
                    ? 'Done'
                    : task.status}
                </Badge>
              )}
              {task.priority && (
                <Badge className={task.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'} variant="outline">
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              )}
            </div>
          </div>
          <p 
            className="text-sm text-[hsl(var(--text-secondary))] mb-3 line-clamp-2"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {task.description}
          </p>
          <div className="mb-1">
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
          {/* Status update button for assigned staff */}
          {isAssignedStaff && nextStatus && (
            <Button
              className="mt-2 w-full sm:w-auto bg-blue-600 text-white font-semibold rounded-md py-2 px-4 text-center text-base sm:text-sm"
              onClick={handleStatusUpdate}
            >
              {buttonLabel}
            </Button>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}; 