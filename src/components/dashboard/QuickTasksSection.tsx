
// ABOUTME: This component displays a grid of quick-action buttons on the dashboard.
// ABOUTME: It shows different tasks based on the user's role (admin vs. staff).
import { useState } from 'react';
import { Calendar, TreePine, Book, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingModal } from './BookingModal';
import { TreeUpdateModal } from './TreeUpdateModal';
import { ArticleModal } from './ArticleModal';
import AssetManagementModal from './AssetManagementModal';
import { StaffManagementModal } from './StaffManagementModal';

interface QuickTasksSectionProps {
  userRole: string;
}

export function QuickTasksSection({ userRole }: QuickTasksSectionProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const staffTasks = [
    {
      id: 'bookings',
      title: 'Manage Bookings',
      description: 'Update room bookings and guest information',
      icon: Calendar,
      action: () => setOpenModal('bookings'),
    },
    {
      id: 'tree-update',
      title: 'Post a Tree Update',
      description: 'Add new life cycle updates for trees',
      icon: TreePine,
      action: () => setOpenModal('tree-update'),
    },
  ];

  const ownerTasks = [
    {
      id: 'article',
      title: 'Publish Journal Entry',
      description: 'Create new articles for the journal',
      icon: Book,
      action: () => setOpenModal('article'),
    },
    {
      id: 'assets',
      title: 'Manage Farm Assets',
      description: 'Edit rooms and trees information',
      icon: Settings,
      action: () => setOpenModal('assets'),
    },
    {
      id: 'staff',
      title: 'Manage Staff',
      description: 'Add, edit, or remove staff members',
      icon: Users,
      action: () => setOpenModal('staff'),
    },
  ];

  const allTasks = userRole === 'admin' ? [...staffTasks, ...ownerTasks] : staffTasks;

  return (
    <div>
      <h2 
        className="text-2xl text-[hsl(var(--text-accent))] mb-6"
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        Quick Tasks
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTasks.map((task) => (
          <Button
            key={task.id}
            onClick={task.action}
            variant="outline"
            className="h-auto p-6 flex flex-col items-start text-left border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--background-secondary))]"
          >
            <task.icon className="w-6 h-6 mb-3 text-[hsl(var(--text-accent))]" />
            <h3 className="font-medium text-[hsl(var(--text-primary))] mb-2">
              {task.title}
            </h3>
            <p className="text-sm text-[hsl(var(--text-secondary))]">
              {task.description}
            </p>
          </Button>
        ))}
      </div>

      {/* Modals */}
      <BookingModal 
        open={openModal === 'bookings'} 
        onClose={() => setOpenModal(null)} 
      />
      <TreeUpdateModal 
        open={openModal === 'tree-update'} 
        onClose={() => setOpenModal(null)} 
      />
      {userRole === 'admin' && (
        <>
          <ArticleModal 
            open={openModal === 'article'} 
            onClose={() => setOpenModal(null)} 
          />
          <AssetManagementModal 
            open={openModal === 'assets'} 
            onClose={() => setOpenModal(null)} 
          />
          <StaffManagementModal 
            open={openModal === 'staff'} 
            onClose={() => setOpenModal(null)} 
          />
        </>
      )}
    </div>
  );
}
