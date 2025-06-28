
// ABOUTME: This component displays a vertical feed of journal entries.
// ABOUTME: Each entry is presented as a card with image, title, excerpt, and read more link.

import { useState, useEffect } from 'react';
import JournalCard from './JournalCard';
import { supabase } from '../integrations/supabase/client';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  slug: string;
  image_url?: string;
  created_at: string;
}

const JournalFeed = () => {
  const [articles, setArticles] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching articles:', error);
        } else {
          setArticles(data || []);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fallback content for when no articles are available
  const fallbackArticles = [
    {
      id: '1',
      title: 'Morning Mist Over the Coffee Grove',
      content: 'This morning, as I walked through our coffee grove, the mist hung low between the trees like a gentle blanket. The highland air was crisp and clean, carrying the earthy scent of fertile soil and growing things...',
      slug: 'morning-mist-coffee-grove',
      image_url: 'https://ik.imagekit.io/offvxi40h/coffee-grove-mist.jpg?tr=w-800,q-80',
      created_at: '2024-12-01T08:00:00Z'
    },
    {
      id: '2',
      title: 'The Avocado Trees Are Flowering',
      content: 'Something magical is happening in our avocado grove. The trees have begun their flowering season, and tiny cream-colored blossoms dot every branch. Each small flower holds the promise of fruit to come...',
      slug: 'avocado-trees-flowering',
      image_url: 'https://ik.imagekit.io/offvxi40h/avocado-flowers.jpg?tr=w-800,q-80',
      created_at: '2024-11-28T15:30:00Z'
    },
    {
      id: '3',
      title: 'Building the New Greenhouse',
      content: 'We broke ground on our new greenhouse this week. It will be a place where we can nurture seedlings through the cooler highland months and experiment with growing techniques...',
      slug: 'building-new-greenhouse',
      image_url: 'https://ik.imagekit.io/offvxi40h/greenhouse-construction.jpg?tr=w-800,q-80',
      created_at: '2024-11-25T10:15:00Z'
    }
  ];

  const displayArticles = articles.length > 0 ? articles : fallbackArticles;

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-[hsl(var(--stone))] bg-opacity-20 rounded-lg h-64 mb-4"></div>
            <div className="h-4 bg-[hsl(var(--stone))] bg-opacity-20 rounded mb-2"></div>
            <div className="h-4 bg-[hsl(var(--stone))] bg-opacity-20 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 
        className="text-3xl md:text-4xl mb-8 text-[hsl(var(--text-accent))]" 
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        Recent Stories
      </h2>
      
      {displayArticles.map((article) => (
        <JournalCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default JournalFeed;
