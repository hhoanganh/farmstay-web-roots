
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Home, TreePine, Search, Edit } from 'lucide-react';
import { TaskFormModal } from './TaskFormModal';
import { AdminDataTable } from './AdminDataTable';

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
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

const columns = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (info: any) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: (info: any) => {
      const task = info.row.original;
      return (
        <div className="flex items-center gap-1">
          {task.room_id ? <Home className="w-4 h-4" /> : <TreePine className="w-4 h-4" />}
          <span className="text-xs">
            {task.room_id ? 'Room' : 'Tree'}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'related',
    header: 'Related',
    cell: (info: any) => {
      const task = info.row.original;
      return task.room?.name || task.tree?.name || '-';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info: any) => {
      const status = info.getValue();
      return (
        <Badge className={getStatusColor(status)} variant="outline">
          {status}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: (info: any) => {
      const priority = info.getValue();
      return (
        <Badge className={getPriorityColor(priority)} variant="outline">
          {priority}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
    cell: (info: any) => {
      const task = info.row.original;
      return task.assigned_to_profile?.full_name || '-';
    },
  },
  {
    accessorKey: 'due_date',
    header: 'Due Date',
    cell: (info: any) => {
      const date = info.getValue();
      return date ? new Date(date).toLocaleDateString() : '-';
    },
    enableSorting: true,
  },
];

const AdminTasksTable = ({ tasks, assignees = [] }: { tasks: any[], assignees?: any[] }) => {
  const [tab, setTab] = useState<'all' | 'room' | 'tree'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Filtered tasks by tab/type
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Tab filter
      if (tab === 'room' && !task.room_id) return false;
      if (tab === 'tree' && !task.tree_id) return false;
      // Status filter
      if (statusFilter !== 'all' && task.status?.toLowerCase() !== statusFilter) return false;
      // Priority filter
      if (priorityFilter !== 'all' && task.priority?.toLowerCase() !== priorityFilter) return false;
      // Assignee filter
      if (assigneeFilter !== 'all' && task.assigned_to !== assigneeFilter) return false;
      // Search
      if (search && !(`${task.title} ${task.description || ''}`.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [tasks, tab, statusFilter, priorityFilter, assigneeFilter, search]);

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

  const rowActions = (task: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedTask(task);
          setModalMode('edit');
          setModalOpen(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Page Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <Tabs value={tab} onValueChange={v => setTab(v as 'all' | 'room' | 'tree')} className="mb-2 sm:mb-0">
            <TabsList className="w-full grid grid-cols-3 max-w-xs">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="room" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Room</span>
              </TabsTrigger>
              <TabsTrigger value="tree" className="flex items-center gap-1">
                <TreePine className="w-4 h-4" />
                <span className="hidden sm:inline">Tree</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
          <Button
            className="bg-[hsl(var(--interactive-primary))] text-[hsl(var(--interactive-primary-foreground))] font-semibold flex-1 sm:w-auto"
            onClick={() => { 
              setModalMode('create'); 
              setSelectedTask(null); 
              setModalOpen(true); 
            }}
          >
            Create New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--text-secondary))] h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 border-[hsl(var(--border-primary))]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 border-[hsl(var(--border-primary))]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="to do">To Do</SelectItem>
            <SelectItem value="doing">Doing</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32 border-[hsl(var(--border-primary))]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-40 border-[hsl(var(--border-primary))]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {uniqueAssignees.map(([id, name]) => (
              <SelectItem key={id} value={id || ''}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <AdminDataTable
        columns={columns}
        data={filteredTasks}
        rowActions={rowActions}
        filterable={false}
        pagination
      />

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

export default AdminTasksTable;
