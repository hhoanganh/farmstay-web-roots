import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
  children?: React.ReactNode;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, children }) => (
  <Card className="border-[hsl(var(--border-primary))]">
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
      {children}
    </CardContent>
  </Card>
); 