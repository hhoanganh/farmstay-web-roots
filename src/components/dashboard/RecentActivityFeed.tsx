import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'booking' | 'tree_update';
  title: string;
  description: string;
  created_at: string;
}

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      // Fetch recent bookings with customer names
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms(name),
          customers!bookings_customer_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent tree updates
      const { data: treeUpdatesData } = await supabase
        .from('tree_updates')
        .select('*, trees(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      const allActivities: Activity[] = [];

      // Process bookings
      bookingsData?.forEach((booking) => {
        allActivities.push({
          id: booking.id,
          type: 'booking',
          title: `New booking for ${booking.rooms?.name || 'room'}`,
          description: `Guest: ${booking.customers?.full_name || 'N/A'} • ${format(new Date(booking.check_in_date), 'MMM dd')} - ${format(new Date(booking.check_out_date), 'MMM dd')}`,
          created_at: booking.created_at,
        });
      });

      // Process tree updates
      treeUpdatesData?.forEach((update) => {
        allActivities.push({
          id: update.id,
          type: 'tree_update',
          title: `Tree update: ${update.trees?.name || 'Unknown tree'}`,
          description: `Activity: ${update.activity} • ${update.notes ? update.notes.substring(0, 50) + '...' : 'No notes'}`,
          created_at: update.created_at,
        });
      });

      // Sort by date and take top 8
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);

      setActivities(sortedActivities);
    };

    fetchRecentActivity();
  }, []);

  return (
    <div>
      <h2 
        className="text-2xl text-[hsl(var(--text-accent))] mb-6"
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        Recent Activity
      </h2>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-[hsl(var(--text-secondary))]">
            <p style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              No recent activity to show.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-[hsl(var(--background-secondary))] rounded-lg p-4 border border-[hsl(var(--border-primary))] transform rotate-0 hover:rotate-1 transition-transform"
              style={{
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-[hsl(var(--text-primary))]">
                  {activity.title}
                </h3>
                <span className="text-xs text-[hsl(var(--text-secondary))]">
                  {format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                </span>
              </div>
              <p 
                className="text-sm text-[hsl(var(--text-secondary))]"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {activity.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
