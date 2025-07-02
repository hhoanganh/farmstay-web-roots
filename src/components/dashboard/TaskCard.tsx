import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
  children?: React.ReactNode;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, children }) => (
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
          {task.priority && (
            <Badge className={task.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'} variant="outline">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          )}
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
        {children}
      </div>
    </CardContent>
  </Card>
); 