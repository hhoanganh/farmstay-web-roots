
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';

interface TaskUpdate {
  id: string;
  created_at: string;
  notes: string;
  image_urls: string[];
  update_type: string;
  created_by_profile?: { full_name: string };
}

interface Task {
  id: string;
  created_at: string;
  title: string;
  status: string;
  description?: string;
}

interface Tree {
  id: string;
  name: string;
  type?: string;
  description?: string;
  status?: string;
  image_url?: string;
  created_at?: string;
}

interface TimelineUpdateEntry {
  type: 'update';
  id: string;
  date: string;
  notes: string;
  images: string[];
  author?: string;
  updateType?: string;
}

interface TimelineTaskEntry {
  type: 'task';
  id: string;
  date: string;
  notes: string;
  status: string;
}

type TimelineEntry = TimelineUpdateEntry | TimelineTaskEntry;

const TreeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tree, setTree] = useState<Tree | null>(null);
  const [updates, setUpdates] = useState<TaskUpdate[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      // Fetch tree details
      const { data: treeData } = await supabase.from('trees').select('*').eq('id', id).single();
      setTree(treeData);
      // Fetch task updates
      const { data: updatesData } = await supabase
        .from('task_updates')
        .select('*, created_by_profile:profiles(full_name)')
        .eq('tree_id', id)
        .order('created_at', { ascending: true });
      setUpdates(updatesData || []);
      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('tree_id', id)
        .order('created_at', { ascending: true });
      setTasks(tasksData || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Merge and sort updates and tasks by date
  function buildTimeline(updates: TaskUpdate[], tasks: Task[]): TimelineEntry[] {
    const updateEntries: TimelineUpdateEntry[] = updates.map(u => ({
      type: 'update',
      id: u.id,
      date: u.created_at,
      notes: u.notes,
      images: u.image_urls,
      author: u.created_by_profile?.full_name,
      updateType: u.update_type,
    }));

    const taskEntries: TimelineTaskEntry[] = tasks.map(t => ({
      type: 'task',
      id: t.id,
      date: t.created_at,
      notes: t.title + (t.description ? `: ${t.description}` : ''),
      status: t.status,
    }));

    return [...updateEntries, ...taskEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  const timeline = buildTimeline(updates, tasks);

  if (loading) {
    return <div className="text-center py-12 text-[hsl(var(--text-secondary))]">Loading tree story...</div>;
  }
  if (!tree) {
    return <div className="text-center py-12 text-[hsl(var(--text-secondary))]">Tree not found.</div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto">
      <Link to={`/farm-and-garden/trees?type=${tree.type || ''}`} className="inline-flex items-center text-[hsl(var(--text-accent))] mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to {tree.type ? tree.type.charAt(0).toUpperCase() + tree.type.slice(1) : 'Trees'}
      </Link>
      <div className="mb-8 text-center">
        <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4 w-full max-h-72 mx-auto">
          {tree.image_url ? (
            <img src={tree.image_url} alt={tree.name} className="w-full h-full object-cover rounded-md max-h-72" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--text-accent))] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>{tree.name}</h1>
        <div className="flex justify-center gap-2 mb-2">
          <Badge className="bg-[hsl(var(--green)/0.1)] text-[hsl(var(--green))] border-[hsl(var(--green)/0.2)]" variant="outline">{tree.type || 'Tree'}</Badge>
          <Badge className="bg-[hsl(var(--brown)/0.1)] text-[hsl(var(--brown))] border-[hsl(var(--brown)/0.2)]" variant="outline">{tree.status || 'Healthy'}</Badge>
        </div>
        <p className="text-[hsl(var(--text-secondary))] mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{tree.description || 'No description available.'}</p>
        <p className="text-xs text-[hsl(var(--stone))] mb-2 flex items-center justify-center"><Calendar className="h-4 w-4 mr-1" /> Planted {tree.created_at ? new Date(tree.created_at).toLocaleDateString() : 'Unknown'}</p>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Caveat, cursive' }}>Tree Story & Updates</h2>
        {timeline.length === 0 ? (
          <div className="text-center text-[hsl(var(--text-secondary))]">No updates or tasks yet. Check back soon!</div>
        ) : (
          <div className="space-y-6">
            {timeline.map(entry => (
              <Card key={entry.type + '-' + entry.id} className="border-[hsl(var(--border-primary))]">
                <CardHeader className="flex flex-row items-center gap-2">
                  <span className="text-xs text-[hsl(var(--stone))]">{new Date(entry.date).toLocaleString()}</span>
                  {entry.type === 'update' && (
                    <Badge className="bg-[hsl(var(--brown)/0.1)] text-[hsl(var(--brown))] border-[hsl(var(--brown)/0.2)]" variant="outline">Update</Badge>
                  )}
                  {entry.type === 'task' && (
                    <Badge className="bg-[hsl(var(--stone)/0.1)] text-[hsl(var(--stone))] border-[hsl(var(--stone)/0.2)]" variant="outline">Task</Badge>
                  )}
                  {entry.type === 'update' && (entry as TimelineUpdateEntry).updateType && (
                    <Badge className="bg-[hsl(var(--brown)/0.1)] text-[hsl(var(--brown))] border-[hsl(var(--brown)/0.2)]" variant="outline">{(entry as TimelineUpdateEntry).updateType?.charAt(0).toUpperCase() + (entry as TimelineUpdateEntry).updateType?.slice(1)}</Badge>
                  )}
                  {entry.type === 'task' && (entry as TimelineTaskEntry).status && (
                    <Badge className="bg-[hsl(var(--stone)/0.1)] text-[hsl(var(--stone))] border-[hsl(var(--stone)/0.2)]" variant="outline">{(entry as TimelineTaskEntry).status}</Badge>
                  )}
                  {entry.type === 'update' && (entry as TimelineUpdateEntry).author && (
                    <span className="ml-2 text-xs text-[hsl(var(--stone))]">by {(entry as TimelineUpdateEntry).author}</span>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-[hsl(var(--text-primary))]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{entry.notes}</div>
                  {entry.type === 'update' && (entry as TimelineUpdateEntry).images && (entry as TimelineUpdateEntry).images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(entry as TimelineUpdateEntry).images.map((url: string, idx: number) => (
                        <img key={idx} src={url} alt={`Update ${idx + 1}`} className="rounded-md w-full h-32 object-cover" />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="text-center mt-8">
        <Button asChild size="lg" className="bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))] font-semibold">
          <a href="/connect">Adopt this Tree / Contact Us</a>
        </Button>
      </div>
    </div>
  );
};

export default TreeDetailPage;
