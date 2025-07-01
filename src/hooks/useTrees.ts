
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTrees() {
  const [trees, setTrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trees')
        .select('*')
        .order('name');

      if (error) throw error;
      setTrees(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { trees, loading, error, refetch: fetchTrees };
}
