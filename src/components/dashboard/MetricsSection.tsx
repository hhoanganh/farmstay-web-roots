
import { useEffect, useState } from 'react';
import { Calendar, Home, TreePine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function MetricsSection() {
  const [metrics, setMetrics] = useState({
    todayBookings: 0,
    availableRooms: 0,
    availableTrees: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Today's bookings (check-ins and check-outs)
      const { count: todayBookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .or(`check_in_date.eq.${today},check_out_date.eq.${today}`);

      // Available rooms (not currently booked)
      // 1. Get total number of rooms
      const { count: totalRoomsCount } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true });

      // 2. Get IDs of rooms that are currently booked today
      const { data: activeBookings } = await supabase
        .from('bookings')
        .select('room_id')
        .eq('booking_status', 'confirmed')
        .lte('check_in_date', today) // Booking started on or before today
        .gt('check_out_date', today); // Booking ends after today
      
      const bookedRoomIds = activeBookings ? [...new Set(activeBookings.map((b: any) => b.room_id))] : [];
      const availableRoomsCount = (totalRoomsCount || 0) - bookedRoomIds.length;

      // Available trees
      const { count: availableTreesCount } = await supabase
        .from('trees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      setMetrics({
        todayBookings: todayBookingsCount || 0,
        availableRooms: availableRoomsCount < 0 ? 0 : availableRoomsCount,
        availableTrees: availableTreesCount || 0,
      });
    };

    fetchMetrics();
  }, []);

  const metricItems = [
    {
      icon: Calendar,
      label: "Today's Activity",
      value: metrics.todayBookings,
      description: 'Check-ins & Check-outs',
    },
    {
      icon: Home,
      label: 'Available Rooms',
      value: metrics.availableRooms,
      description: 'Ready for guests',
    },
    {
      icon: TreePine,
      label: 'Available Trees',
      value: metrics.availableTrees,
      description: 'Ready to rent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metricItems.map((item, index) => (
        <div
          key={index}
          className="bg-[hsl(var(--background-secondary))] rounded-lg p-6 border border-[hsl(var(--border-primary))] text-center"
        >
          <item.icon className="w-8 h-8 mx-auto mb-3 text-[hsl(var(--text-accent))]" />
          <div 
            className="text-3xl font-bold text-[hsl(var(--text-primary))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            {item.value}
          </div>
          <h3 className="font-medium text-[hsl(var(--text-primary))] mb-1">
            {item.label}
          </h3>
          <p className="text-sm text-[hsl(var(--text-secondary))]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
