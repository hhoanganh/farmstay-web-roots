import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Home, TreePine, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface MorningReportViewProps {
  userRole: string;
}

interface Metrics {
  todayBookings: number;
  availableRooms: number;
  availableTrees: number;
  weeklyBookings: number;
}

interface QuickTask {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  time: string;
  description: string;
}

export function MorningReportView({ userRole }: MorningReportViewProps) {
  const [metrics, setMetrics] = useState<Metrics>({
    todayBookings: 0,
    availableRooms: 0,
    availableTrees: 0,
    weeklyBookings: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchMetrics();
    fetchRecentActivity();
  }, []);

  const fetchMetrics = async () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Today's bookings
    const { data: todayBookings } = await supabase
      .from('bookings')
      .select('*')
      .or(`check_in_date.eq.${today},check_out_date.eq.${today}`);

    // Available rooms
    const { data: rooms } = await supabase
      .from('rooms')
      .select('*');

    // Available trees
    const { data: trees } = await supabase
      .from('trees')
      .select('*')
      .eq('status', 'available');

    // Weekly bookings
    const { data: weeklyBookings } = await supabase
      .from('bookings')
      .select('*')
      .gte('created_at', weekAgo);

    setMetrics({
      todayBookings: todayBookings?.length || 0,
      availableRooms: rooms?.length || 0,
      availableTrees: trees?.length || 0,
      weeklyBookings: weeklyBookings?.length || 0,
    });
  };

  const fetchRecentActivity = async () => {
    // Fetch recent bookings with customer names
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms(name),
        customers!bookings_customer_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentUpdates } = await supabase
      .from('tree_updates')
      .select('*, trees(name)')
      .order('created_at', { ascending: false })
      .limit(3);

    const activityList: Activity[] = [];

    recentBookings?.forEach((booking) => {
      activityList.push({
        id: booking.id,
        type: 'booking',
        title: `New booking for ${booking.rooms?.name || 'room'}`,
        time: format(new Date(booking.created_at), 'HH:mm'),
        description: `Guest: ${booking.customers?.full_name || 'N/A'}`,
      });
    });

    recentUpdates?.forEach((update) => {
      activityList.push({
        id: update.id,
        type: 'tree_update',
        title: `Tree update: ${update.trees?.name || 'Unknown'}`,
        time: format(new Date(update.created_at), 'HH:mm'),
        description: update.activity,
      });
    });

    // Sort by time and take latest 5
    activityList.sort((a, b) => b.time.localeCompare(a.time));
    setActivities(activityList.slice(0, 5));
  };

  const staffTasks: QuickTask[] = [
    {
      id: 'check-bookings',
      title: 'Check Today\'s Bookings',
      description: 'Review check-ins and check-outs',
      icon: Calendar,
      action: () => console.log('Navigate to bookings'),
    },
    {
      id: 'update-trees',
      title: 'Post Tree Update',
      description: 'Add new life cycle updates',
      icon: TreePine,
      action: () => console.log('Open tree update modal'),
    },
  ];

  const adminTasks: QuickTask[] = [
    ...staffTasks,
    {
      id: 'publish-article',
      title: 'Publish Journal Entry',
      description: 'Create new farm stories',
      icon: Clock,
      action: () => console.log('Navigate to journal'),
    },
    {
      id: 'manage-staff',
      title: 'Manage Staff',
      description: 'Add or update team members',
      icon: TrendingUp,
      action: () => console.log('Navigate to staff'),
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Check farm performance',
      icon: TrendingUp,
      action: () => console.log('Open analytics'),
    },
  ];

  const quickTasks = userRole === 'admin' ? adminTasks : staffTasks;

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 
          className="text-4xl text-[hsl(var(--text-accent))] mb-2"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          Morning Report
        </h1>
        <p 
          className="text-[hsl(var(--text-secondary))]"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Today's Focus - Metrics */}
      <div className="mb-8">
        <h2 
          className="text-2xl text-[hsl(var(--text-accent))] mb-4"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          Today's Focus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-[hsl(var(--border-primary))]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                Today's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-[hsl(var(--text-accent))] mr-2" />
                <span 
                  className="text-2xl font-bold text-[hsl(var(--text-primary))]"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  {metrics.todayBookings}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border-primary))]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                Available Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="h-4 w-4 text-[hsl(var(--text-accent))] mr-2" />
                <span 
                  className="text-2xl font-bold text-[hsl(var(--text-primary))]"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  {metrics.availableRooms}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border-primary))]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                Available Trees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TreePine className="h-4 w-4 text-[hsl(var(--text-accent))] mr-2" />
                <span 
                  className="text-2xl font-bold text-[hsl(var(--text-primary))]"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  {metrics.availableTrees}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border-primary))]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                Weekly Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-[hsl(var(--text-accent))] mr-2" />
                <span 
                  className="text-2xl font-bold text-[hsl(var(--text-primary))]"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  {metrics.weeklyBookings}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Tasks */}
      <div className="mb-8">
        <h2 
          className="text-2xl text-[hsl(var(--text-accent))] mb-4"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          Quick Tasks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTasks.map((task) => (
            <Card key={task.id} className="border-[hsl(var(--border-primary))] hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <task.icon className="h-5 w-5 text-[hsl(var(--text-accent))] mt-0.5" />
                  <div className="flex-1">
                    <h3 
                      className="font-medium text-[hsl(var(--text-primary))] mb-1"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {task.title}
                    </h3>
                    <p 
                      className="text-sm text-[hsl(var(--text-secondary))]"
                      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 
          className="text-2xl text-[hsl(var(--text-accent))] mb-4"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          Recent Activity
        </h2>
        <Card className="border-[hsl(var(--border-primary))]">
          <CardContent className="p-6">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <p 
                  className="text-[hsl(var(--text-secondary))]"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  No recent activity to show.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-[hsl(var(--border-primary))] last:border-b-0 last:pb-0">
                    <div className="w-2 h-2 bg-[hsl(var(--text-accent))] rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 
                          className="font-medium text-[hsl(var(--text-primary))]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {activity.title}
                        </h4>
                        <span 
                          className="text-sm text-[hsl(var(--text-secondary))]"
                          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        >
                          {activity.time}
                        </span>
                      </div>
                      <p 
                        className="text-sm text-[hsl(var(--text-secondary))] mt-1"
                        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                      >
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
