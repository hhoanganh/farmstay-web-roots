
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
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .or(`check_in_date.eq.${today},check_out_date.eq.${today}`);

      // Available rooms (not currently booked)
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*');

      // Available trees
      const { data: treesData } = await supabase
        .from('trees')
        .select('*')
        .eq('status', 'available');

      setMetrics({
        todayBookings: bookingsData?.length || 0,
        availableRooms: roomsData?.length || 0,
        availableTrees: treesData?.length || 0,
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
