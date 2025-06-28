
// ABOUTME: This component represents a single journal entry card.
// ABOUTME: It displays an image, title, excerpt, and read more link.

import { Link } from 'react-router-dom';
import ImageWrapper from './ImageWrapper';

interface JournalCardProps {
  article: {
    id: string;
    title: string;
    content: string;
    slug: string;
    image_url?: string;
    created_at: string;
  };
}

const JournalCard = ({ article }: JournalCardProps) => {
  // Extract first 150 characters for excerpt
  const excerpt = article.content.length > 150 
    ? article.content.substring(0, 150) + '...' 
    : article.content;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="group">
      {/* Image */}
      {article.image_url && (
        <div className="mb-6">
          <ImageWrapper 
            src={article.image_url} 
            alt={article.title}
            className="w-full max-w-md mx-auto lg:mx-0"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Date */}
        <time 
          className="text-sm text-[hsl(var(--text-secondary))] block"
          style={{ fontFamily: 'Inter, sans-serif' }}
          dateTime={article.created_at}
        >
          {formatDate(article.created_at)}
        </time>

        {/* Title */}
        <h3 
          className="text-2xl md:text-3xl text-[hsl(var(--text-accent))] group-hover:text-[hsl(var(--text-primary))] transition-colors"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p 
          className="text-base leading-relaxed text-[hsl(var(--text-primary))]"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {excerpt}
        </p>

        {/* Read More Link */}
        <Link
          to={`/experiences/journal/${article.slug}`}
          className="inline-flex items-center gap-2 text-[hsl(var(--text-accent))] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2 rounded-sm px-2 py-2 min-h-[44px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Read More
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default JournalCard;
