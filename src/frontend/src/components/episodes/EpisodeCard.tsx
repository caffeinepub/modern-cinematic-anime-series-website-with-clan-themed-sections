import { Episode } from '../../data/episodes';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
  onWatch?: (episode: Episode) => void;
}

export function EpisodeCard({ episode, onWatch }: EpisodeCardProps) {
  const isReleased = episode.status === 'Released';

  return (
    <div className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:glow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold">
            {episode.number}
          </div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {episode.title}
          </h3>
        </div>
        <Badge
          variant={isReleased ? 'default' : 'secondary'}
          className={isReleased ? 'bg-primary/20 text-primary border-primary/30' : 'bg-muted text-muted-foreground'}
        >
          {episode.status}
        </Badge>
      </div>
      <p className="text-muted-foreground leading-relaxed mb-4">{episode.summary}</p>
      
      {onWatch && (
        <Button
          onClick={() => onWatch(episode)}
          variant={isReleased ? 'default' : 'outline'}
          className="w-full group/btn"
        >
          <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          Watch Episode
        </Button>
      )}
    </div>
  );
}
