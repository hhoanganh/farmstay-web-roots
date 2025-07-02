import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingsView } from './BookingsView';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

// Mock data
const rooms = [
  { id: 'room1', name: 'Orchard House', description: 'A cozy room', price: 100, image_urls: [] },
];
const bookings = [
  {
    id: 'booking1',
    guest_id: 'guest1',
    room_id: 'room1',
    check_in_date: '2024-06-10',
    check_out_date: '2024-06-12',
    booking_status: 'confirmed',
    created_at: '2024-06-01',
    customer_id: 'customer1',
    customers: { full_name: 'Alice' },
  },
];

// Mock supabase and AuthProvider
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), delete: vi.fn().mockReturnThis(), then: vi.fn() })),
  },
}));
vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({ session: {}, userProfile: { role: 'admin' } }),
}));

// Mock fetchRooms and fetchBookings
vi.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

// Test suite

describe('BookingsView - Calendar Tab', () => {
  it('renders the calendar and displays bookings as events', async () => {
    render(<BookingsView userRole="admin" />);
    // Switch to calendar tab
    fireEvent.click(screen.getByText('View by Calendar'));
    // Calendar should be in the document
    expect(await screen.findByText('Orchard House: Alice')).toBeInTheDocument();
  });

  it('opens BookingModal when a calendar event is clicked', async () => {
    render(<BookingsView userRole="admin" />);
    fireEvent.click(screen.getByText('View by Calendar'));
    // Simulate clicking the event (mocked)
    fireEvent.click(await screen.findByText('Orchard House: Alice'));
    // Modal should open (look for modal content)
    await waitFor(() => {
      expect(screen.getByText(/Edit Booking/i)).toBeInTheDocument();
    });
  });
}); 