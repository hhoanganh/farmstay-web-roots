import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

// Types for tree, update, and task
interface Tree {
  id: string;
  name: string;
  type: string;
  status?: string;
  image_url?: string;
  description?: string;
}
interface TreeUpdate {
  id: string;
  tree_id: string;
  created_at: string;
  activity: string;
  notes?: string;
  image_url?: string;
}
interface Task {
  id: string;
  tree_id: string;
  title: string;
  created_at: string;
  due_date?: string;
  completed_at?: string;
  status: string;
  completion_image_urls?: string[];
}

interface TreeDetailProps {
  tree: Tree;
  fetchTreeUpdates: (treeId: string) => Promise<TreeUpdate[]>;
  fetchTreeTasks: (treeId: string) => Promise<Task[]>;
}

const TreeDetail: React.FC<TreeDetailProps> = ({ tree, fetchTreeUpdates, fetchTreeTasks }) => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState<TreeUpdate[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetchTreeUpdates(tree.id),
      fetchTreeTasks(tree.id)
    ])
      .then(([updates, tasks]) => {
        if (mounted) {
          setUpdates(updates);
          setTasks(tasks);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Failed to load tree history.');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [tree.id, fetchTreeUpdates, fetchTreeTasks]);

  // Merge and sort updates/tasks by date (most recent first)
  const timeline = useMemo(() => {
    const updateItems = updates.map(u => ({
      type: 'update' as const,
      id: u.id,
      date: u.created_at,
      activity: u.activity,
      notes: u.notes,
      image_url: u.image_url
    }));
    const taskItems = tasks.map(t => ({
      type: 'task' as const,
      id: t.id,
      date: t.completed_at || t.due_date || t.created_at,
      activity: t.title,
      notes: t.status,
      image_url: t.completion_image_urls && t.completion_image_urls[0]
    }));
    return [...updateItems, ...taskItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [updates, tasks]);

  if (loading) return <div className="py-12 text-center text-[hsl(var(--text-secondary))]">Loading tree story…</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Back button */}
      <button
        className="mb-4 text-[hsl(var(--text-accent))] font-medium flex items-center hover:underline focus:underline"
        onClick={() => navigate(-1)}
        aria-label="Back to Tree Stories"
      >
        <span className="mr-1">←</span> Back to Tree Stories
      </button>

      {/* Hero section */}
      <div className="mb-4">
        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-2">
          {tree.image_url ? (
            <img src={tree.image_url} alt={tree.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-[hsl(var(--text-accent))] mb-1" style={{ fontFamily: 'Caveat, cursive' }}>{tree.name}</h1>
        <div className="text-sm text-[hsl(var(--text-secondary))] mb-1 capitalize">{tree.type} tree</div>
        {tree.status && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">{tree.status}</span>}
        {tree.description && <p className="text-base text-[hsl(var(--text-primary))] mt-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{tree.description}</p>}
      </div>

      {/* Timeline/history */}
      <div className="mt-6 mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Caveat, cursive' }}>Tree Story & History</h2>
        {timeline.length === 0 ? (
          <div className="text-[hsl(var(--text-secondary))] text-center">No updates or tasks yet. Check back soon!</div>
        ) : (
          <ol className="relative border-l border-gray-200">
            {timeline.map(item => (
              <li key={item.type + '-' + item.id} className="mb-8 ml-4">
                <div className="absolute w-3 h-3 bg-[hsl(var(--text-accent))] rounded-full -left-1.5 border border-white"></div>
                <time className="block mb-1 text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</time>
                <div className="font-semibold text-[hsl(var(--text-primary))]">{item.activity}</div>
                {item.notes && <div className="text-sm text-[hsl(var(--text-secondary))] mb-1">{item.notes}</div>}
                {item.image_url && (
                  <img src={item.image_url} alt="update" className="mt-1 rounded-md max-h-40 w-auto" />
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 bg-white py-4 flex justify-center z-10">
        <Button asChild size="lg" className="bg-[hsl(var(--background-secondary))] text-[hsl(var(--text-accent))] font-semibold">
          <a href="/connect">Adopt this Tree</a>
        </Button>
      </div>
    </div>
  );
};

export default TreeDetail; 