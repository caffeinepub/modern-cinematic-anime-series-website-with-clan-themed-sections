import { Episode } from '../../data/episodes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface EpisodePlayerDialogProps {
  episode: Episode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EpisodePlayerDialog({ episode, open, onOpenChange }: EpisodePlayerDialogProps) {
  if (!episode) return null;

  const hasVideo = episode.videoUrl && episode.videoUrl.trim() !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-sm">
              {episode.number}
            </div>
            {episode.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {episode.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {hasVideo ? (
            <div className="video-container relative w-full bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-auto"
                poster={episode.thumbnailUrl || undefined}
                preload="metadata"
              >
                <source src={episode.videoUrl} type="video/mp4" />
                <source src={episode.videoUrl} type="video/webm" />
                <source src={episode.videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <Alert className="border-primary/30 bg-primary/5">
              <AlertCircle className="h-5 w-5 text-primary" />
              <AlertDescription className="text-foreground">
                The video for this episode is not available yet. Please check back later!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
