import { useState } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { useGetAllEpisodes } from '../../hooks/useQueries';
import { EpisodeCard } from '../episodes/EpisodeCard';
import { EpisodePlayerDialog } from '../episodes/EpisodePlayerDialog';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { decodeEpisodeMetadata } from '../../utils/adminContentAdapters';
import { Episode } from '../../data/episodes';
import { toast } from 'sonner';

export function EpisodesSection() {
  const { ref, isVisible } = useRevealOnScroll();
  const { data: backendEpisodes = [], isLoading, error } = useGetAllEpisodes();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  // Transform backend episodes to match the expected format
  const episodes = backendEpisodes.map((ep) => {
    const { description, metadata } = decodeEpisodeMetadata(ep.description);
    return {
      number: metadata.number || 0,
      title: ep.title,
      summary: description,
      status: (metadata.status || 'Coming Soon') as 'Released' | 'Coming Soon',
      videoUrl: ep.videoUrl || '',
      thumbnailUrl: ep.thumbnailUrl || '',
    };
  }).sort((a, b) => a.number - b.number);

  const handleWatchEpisode = (episode: Episode) => {
    if (episode.status !== 'Released') {
      toast.error('Episode Not Released', {
        description: 'This episode has not been released yet. Please check back later!',
      });
      return;
    }
    setSelectedEpisode(episode);
  };

  return (
    <>
      <section
        id="episodes"
        ref={ref}
        className={`py-24 px-4 bg-gradient-to-b from-background via-background/95 to-background ${
          isVisible ? 'animate-fade-up' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Season 1 Episodes
            </span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            Follow the epic journey through Season 1 as ancient powers awaken and destinies collide.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load episodes: {error.message}</AlertDescription>
            </Alert>
          ) : episodes.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No episodes available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.number} episode={episode} onWatch={handleWatchEpisode} />
              ))}
            </div>
          )}
        </div>
      </section>

      <EpisodePlayerDialog
        episode={selectedEpisode}
        open={!!selectedEpisode}
        onOpenChange={(open) => !open && setSelectedEpisode(null)}
      />
    </>
  );
}
