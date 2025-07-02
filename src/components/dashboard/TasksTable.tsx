import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Home, TreePine, Search } from 'lucide-react';
import { TaskFormModal } from './TaskFormModal';

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
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
}

function getPriorityColor(priority: string) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function isOverdue(task: any) {
  if (!task.due_date || task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed') return false;
  return new Date(task.due_date) < new Date();
}

const TasksTable = ({ tasks, userRole, assignees = [] }: { tasks: any[], userRole: string, assignees?: any[] }) => {
  // Remove all filter state
  // const [statusFilter, setStatusFilter] = useState('all');
  // const [priorityFilter, setPriorityFilter] = useState('all');
  // const [assigneeFilter, setAssigneeFilter] = useState('all');
  // const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // No filtering, just show all tasks
  const filteredTasks = tasks;

  // Unique assignees for filter dropdown
  const uniqueAssignees = useMemo(() => {
    const map = new Map();
    tasks.forEach(task => {
      if (task.assigned_to_profile) {
        map.set(task.assigned_to, task.assigned_to_profile.full_name);
      }
    });
    return Array.from(map.entries());
  }, [tasks]);

  return (
    <div className="w-full">
      {/* Page Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div />
        <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
          <Button
            className="bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))] font-semibold flex-1 sm:w-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
            onClick={() => { setModalMode('create'); setSelectedTask(null); setModalOpen(true); }}
          >
            Create New Task
          </Button>
        </div>
      </div>
      {/* Table (desktop) */}
      <div className="hidden sm:block">
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-[hsl(var(--background-secondary))]">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Related</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Priority</th>
              <th className="p-2 text-left">Assignee</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8">No tasks found</td></tr>
            )}
            {filteredTasks.map(task => (
              <tr key={task.id} className={
                `${task.priority === 'high' ? 'border-l-4 border-red-400' : ''} ${isOverdue(task) ? 'bg-yellow-50' : ''}`
              }>
                <td className="p-2 font-medium">{task.title}</td>
                <td className="p-2">
                  {task.room_id ? <Home className="inline w-4 h-4 mr-1" /> : <TreePine className="inline w-4 h-4 mr-1" />}
                  {task.room_id ? 'Room' : 'Tree'}
                </td>
                <td className="p-2">{task.room?.name || task.tree?.name || '-'}</td>
                <td className="p-2"><Badge className={getStatusColor(task.status)}>{task.status}</Badge></td>
                <td className="p-2"><Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge></td>
                <td className="p-2">{task.assigned_to_profile?.full_name || '-'}</td>
                <td className="p-2">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                <td className="p-2">
                  <Button size="sm" variant="outline">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards (mobile) */}
      <div className="sm:hidden space-y-4">
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">No tasks found</div>
        )}
        {filteredTasks.map(task => (
          <div key={task.id} className={`rounded-lg border p-4 shadow-sm ${task.priority === 'high' ? 'border-red-400' : ''} ${isOverdue(task) ? 'bg-yellow-50' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              {task.room_id ? <Home className="w-5 h-5" /> : <TreePine className="w-5 h-5" />}
              <span className="font-semibold text-lg">{task.title}</span>
              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>
            <div className="text-sm mb-1"><strong>Related:</strong> {task.room?.name || task.tree?.name || '-'}</div>
            <div className="text-sm mb-1"><strong>Assignee:</strong> {task.assigned_to_profile?.full_name || '-'}</div>
            <div className="text-sm mb-1"><strong>Due:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" className="flex-1">Edit</Button>
            </div>
          </div>
        ))}
      </div>
      {/* Task creation modal */}
      <TaskFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setModalOpen(false)}
        task={selectedTask}
        mode={modalMode}
      />
    </div>
  );
};

export default TasksTable; 