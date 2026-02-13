import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog';
import { WorldMapLocation } from '../../data/worldMapLocations';
import { X, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

interface WorldMapLoreDialogProps {
  location: WorldMapLocation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorldMapLoreDialog({ location, open, onOpenChange }: WorldMapLoreDialogProps) {
  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-2 border-border/50 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {location.name}
                </DialogTitle>
                {location.region && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {location.region}
                    {location.clan && ` • ${location.clan}`}
                  </p>
                )}
              </div>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-muted"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="mt-4 space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-base text-foreground/90 leading-relaxed">
                {location.loreText}
              </p>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
