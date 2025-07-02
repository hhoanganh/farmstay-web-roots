import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TasksView } from './TasksView';
import { AuthProvider } from '@/providers/AuthProvider';

// Mock useTasks to provide a staff task
vi.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [
      {
        id: '1',
        title: 'Test Task',
        status: 'to do',
        assigned_to: 'staff-1',
        assigned_to_profile: { full_name: 'Staff User' },
        created_by_profile: { full_name: 'Admin User' },
        room: { name: 'Room 1' },
        priority: 'medium',
        due_date: '2025-01-01',
        updates: [],
      },
    ],
    loading: false,
    error: null,
    refreshTasks: vi.fn(),
    updateTaskStatus: vi.fn(),
    addTaskUpdate: vi.fn(),
  })
}));

// Mock useAuth to provide a staff user
vi.mock('@/providers/AuthProvider', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({ userProfile: { id: 'staff-1', role: 'staff', full_name: 'Staff User' } })
  };
});

describe('TasksView (staff)', () => {
  it('shows Task Details modal when staff clicks a task card', async () => {
    render(
      <AuthProvider>
        <TasksView userRole="staff" />
      </AuthProvider>
    );
    // Find the task card
    const card = await screen.findByText('Test Task');
    // Click the card
    fireEvent.click(card);
    // The modal should appear with Task Details
    expect(await screen.findByText('Task Details')).toBeInTheDocument();
    // Should show the task title in the modal
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
}); 