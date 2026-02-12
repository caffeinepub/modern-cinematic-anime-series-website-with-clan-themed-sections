import { NewsPost } from '../../backend';
import { Calendar } from 'lucide-react';

interface NewsPostCardProps {
  post: NewsPost;
}

export function NewsPostCard({ post }: NewsPostCardProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <article className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:glow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-2xl font-bold text-foreground">{post.title}</h3>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full whitespace-nowrap">
          {post.author}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="h-4 w-4" />
        <time dateTime={new Date(Number(post.timestamp) / 1000000).toISOString()}>
          {formatDate(post.timestamp)}
        </time>
      </div>
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
    </article>
  );
}
