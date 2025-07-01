import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  booking?: any | null;
  refreshBookings?: () => void;
}

export function BookingModal({ open, onClose, booking, refreshBookings }: BookingModalProps) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchRooms();
      if (booking) {
        setSelectedRoom(booking.room_id || '');
        setGuestName(booking.customers?.full_name || '');
        setGuestEmail(booking.customers?.email || '');
        setCheckInDate(booking.check_in_date ? booking.check_in_date.slice(0, 10) : '');
        setCheckOutDate(booking.check_out_date ? booking.check_out_date.slice(0, 10) : '');
        setStatus(booking.booking_status || 'confirmed');
      } else {
        setSelectedRoom('');
        setGuestName('');
        setGuestEmail('');
        setCheckInDate('');
        setCheckOutDate('');
        setStatus('confirmed');
      }
    }
  }, [open, booking]);

  const fetchRooms = async () => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .order('name');
    if (data) {
      setRooms(data);
    }
  };

  const checkOverlap = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) return false;
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('room_id', selectedRoom)
      .lte('check_in_date', checkOutDate)
      .gte('check_out_date', checkInDate);

    if (booking?.id) {
      query = query.neq('id', booking.id);
    }

    const { data } = await query;
    return data && data.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validation
    if (!selectedRoom || !guestName || !checkInDate || !checkOutDate || !status) {
      toast({ title: 'All fields except email are required.', variant: 'destructive' });
      setLoading(false);
      return;
    }
    if (checkInDate > checkOutDate) {
      toast({ title: 'Check-in date must be before check-out date.', variant: 'destructive' });
      setLoading(false);
      return;
    }
    // Overlap check
    const overlap = await checkOverlap();
    if (overlap) {
      toast({ title: 'This room is already booked for the selected dates.', variant: 'destructive' });
      setLoading(false);
      return;
    }
    try {
      let customerId = booking?.customer_id;
      // If creating or guest info changed, create/update customer
      if (!customerId || guestName !== booking?.customers?.full_name || guestEmail !== booking?.customers?.email) {
        // Try to find existing customer by email
        let customerData = null;
        if (guestEmail) {
          const { data } = await supabase.from('customers').select('*').eq('email', guestEmail).single();
          customerData = data;
        }
        if (!customerData) {
          // Create new customer
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({ full_name: guestName, email: guestEmail })
            .select()
            .single();
          if (customerError) throw customerError;
          customerId = newCustomer.id;
        } else {
          customerId = customerData.id;
        }
      }
      if (booking) {
        // Edit mode
        const { error } = await supabase
          .from('bookings')
          .update({
            room_id: selectedRoom,
            customer_id: customerId,
            guest_id: customerId,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            booking_status: status,
          })
          .eq('id', booking.id);
        if (error) throw error;
        toast({ title: 'Booking updated' });
      } else {
        // Create mode
        const { error } = await supabase
          .from('bookings')
          .insert({
            room_id: selectedRoom,
            customer_id: customerId,
            guest_id: customerId,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            booking_status: status,
          });
        if (error) throw error;
        toast({ title: 'Booking created' });
      }
      if (refreshBookings) refreshBookings();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save booking',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle 
            className="text-[hsl(var(--text-accent))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            {booking ? 'Edit Booking' : 'Create New Booking'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="room">Room</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="guest">Guest Name</Label>
            <Input
              id="guest"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Guest Email</Label>
            <Input
              id="email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Check-in Date</Label>
              <Input
                id="checkin"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-out Date</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (booking ? 'Saving...' : 'Creating...') : (booking ? 'Save Changes' : 'Create Booking')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
