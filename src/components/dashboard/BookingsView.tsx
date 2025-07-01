import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { BookingModal } from './BookingModal';
import { RoomManagementModal } from './RoomManagementModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/providers/AuthProvider';

interface BookingsViewProps {
  userRole: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
}

interface Booking {
  id: string;
  guest_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  booking_status: string;
  created_at: string;
  customer_id: string;
  customers?: {
    full_name: string;
  };
}

export function BookingsView({ userRole }: BookingsViewProps) {
  const { session, userProfile } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('rooms');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [guestPhone, setGuestPhone] = useState('');
  const [guestNotes, setGuestNotes] = useState('');

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name');

    if (!error && data) {
      setRooms(data);
    }
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers!bookings_customer_id_fkey(full_name)
      `)
      .order('check_in_date', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
  };

  const getRoomBookings = (roomId: string) => {
    return bookings.filter(booking => booking.room_id === roomId);
  };

  const handleAddBooking = () => {
    setEditingBooking(null);
    setBookingModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setBookingModalOpen(true);
  };

  const handleDeleteBooking = (booking: Booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    await supabase.from('bookings').delete().eq('id', bookingToDelete.id);
    setDeleteDialogOpen(false);
    setBookingToDelete(null);
    fetchBookings();
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 
            className="text-4xl text-[hsl(var(--text-accent))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Bookings
          </h1>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Manage room bookings and reservations
          </p>
        </div>
        <div className="flex gap-2">
          {userRole === 'admin' && (
            <Button
              variant="outline"
              onClick={() => setRoomModalOpen(true)}
              className="h-12"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Manage Rooms
            </Button>
          )}
          <Button 
            className="bg-[hsl(var(--interactive-primary))] text-[hsl(var(--interactive-primary-foreground))] font-semibold h-12"
            style={{ fontFamily: 'Inter, sans-serif' }}
            onClick={handleAddBooking}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Booking
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--text-secondary))] h-4 w-4" />
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[hsl(var(--border-primary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="rooms" style={{ fontFamily: 'Inter, sans-serif' }}>
            View by Room
          </TabsTrigger>
          <TabsTrigger value="calendar" style={{ fontFamily: 'Inter, sans-serif' }}>
            View by Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => {
              const roomBookings = getRoomBookings(room.id);
              const activeBookings = roomBookings.filter(b => b.booking_status === 'confirmed');
              
              return (
                <Card key={room.id} className="border-[hsl(var(--border-primary))] hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle 
                      className="text-[hsl(var(--text-primary))]"
                      style={{ fontFamily: 'Caveat, cursive' }}
                    >
                      {room.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p 
                        className="text-sm text-[hsl(var(--text-secondary))]"
                        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                      >
                        {room.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-lg font-bold text-[hsl(var(--text-accent))]"
                          style={{ fontFamily: 'Caveat, cursive' }}
                        >
                          ${room.price}/night
                        </span>
                        <div className="flex items-center text-sm text-[hsl(var(--text-secondary))]">
                          <Calendar className="h-4 w-4 mr-1" />
                          {activeBookings.length} bookings
                        </div>
                      </div>
                      {/* Bookings List */}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Bookings</h4>
                        {roomBookings.length === 0 ? (
                          <div className="text-sm text-gray-500">No bookings for this room.</div>
                        ) : (
                          <ul className="space-y-2">
                            {roomBookings.map(booking => (
                              <li key={booking.id} className="flex items-center justify-between border rounded p-2">
                                <div>
                                  <div className="font-medium">{booking.customers?.full_name || 'Unknown Guest'}</div>
                                  <div className="text-xs text-gray-500">
                                    {format(new Date(booking.check_in_date), 'yyyy-MM-dd')} → {format(new Date(booking.check_out_date), 'yyyy-MM-dd')}
                                  </div>
                                  <div className="text-xs">Status: {booking.booking_status}</div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditBooking(booking)}>
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDeleteBooking(booking)}>
                                    Delete
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card className="border-[hsl(var(--border-primary))]">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
                <h3 
                  className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  Calendar View
                </h3>
                <p 
                  className="text-[hsl(var(--text-secondary))]"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  Interactive calendar showing all bookings will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        booking={editingBooking}
        refreshBookings={fetchBookings}
      />
      {/* RoomManagementModal would go here for admin */}
      {userRole === 'admin' && (
        <RoomManagementModal
          open={roomModalOpen}
          onClose={() => setRoomModalOpen(false)}
          refreshRooms={fetchRooms}
        />
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this booking? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteBooking}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
