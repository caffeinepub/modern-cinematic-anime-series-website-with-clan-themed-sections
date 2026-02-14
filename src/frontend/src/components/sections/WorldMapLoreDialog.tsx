import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog';
import { WorldMapLocation } from '../../data/worldMapLocations';
import { X, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { markFragmentFound, markVaultDiscovered } from '../secrets/secretProgress';
import { toast } from 'sonner';

interface WorldMapLoreDialogProps {
  location: WorldMapLocation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorldMapLoreDialog({ location, open, onOpenChange }: WorldMapLoreDialogProps) {
  useEffect(() => {
    if (open && location) {
      // Check if this location unlocks a secret
      if (location.name === 'Whispering Sea') {
        markFragmentFound('fragment1');
        markVaultDiscovered();
        toast.success('🔓 Secret discovered! Check the vault.', {
          description: 'You found a lore fragment. Navigate to #vault to view your discoveries.',
          duration: 5000
        });
      }
    }
  }, [open, location]);

  if (!location) return null;

  const handleSecretClick = () => {
    markFragmentFound('fragment2');
    toast.success('🔓 Hidden secret unlocked!', {
      description: 'A new lore fragment has been added to your vault.',
      duration: 5000
    });
  };

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
            
            {/* Hidden discovery mechanic */}
            {location.name === 'Frozen Tides' && (
              <div className="pt-4 border-t border-border/50">
                <button
                  onClick={handleSecretClick}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Sparkles className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:animate-pulse-glow" />
                  <span className="opacity-70 group-hover:opacity-100">
                    Something glimmers in the ice...
                  </span>
                </button>
              </div>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
