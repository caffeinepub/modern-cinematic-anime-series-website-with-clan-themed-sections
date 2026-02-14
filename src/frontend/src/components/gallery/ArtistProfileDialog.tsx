import { useState } from 'react';
import { useGetArtistProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Star, Award, Sparkles, TrendingUp, ImageOff } from 'lucide-react';
import { GalleryLightbox } from './GalleryLightbox';

interface ArtistProfileDialogProps {
  artistName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BADGE_CONFIG = {
  'Rising Artist': { icon: TrendingUp, color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/30' },
  'Community Favorite': { icon: Star, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/30' },
  'Monthly Champion': { icon: Award, color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/30' },
  'Legendary Creator': { icon: Sparkles, color: 'text-accent', bgColor: 'bg-accent/10 border-accent/30' },
};

export function ArtistProfileDialog({ artistName, open, onOpenChange }: ArtistProfileDialogProps) {
  const { data: profile, isLoading } = useGetArtistProfile(artistName);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Transform artworks for lightbox
  const lightboxItems = profile?.artworks.map((artwork) => ({
    id: artwork.id.toString(),
    title: artwork.artworkTitle,
    category: 'Fan Art',
    src: artwork.imageUrl,
    alt: artwork.artworkTitle,
  })) || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {artistName}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="aspect-video w-full" />
                ))}
              </div>
            </div>
          ) : !profile ? (
            <div className="text-center py-8 text-muted-foreground">
              Artist profile not found
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground text-lg">{profile.totalVotes}</span>
                  <span className="text-muted-foreground">Total Votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-foreground text-lg">{profile.submittedCount}</span>
                  <span className="text-muted-foreground">Artworks</span>
                </div>
              </div>

              {/* Badges */}
              {profile.badges.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge) => {
                      const config = BADGE_CONFIG[badge];
                      const Icon = config.icon;
                      return (
                        <Badge
                          key={badge}
                          variant="outline"
                          className={`${config.bgColor} ${config.color} border text-sm py-1.5 px-3`}
                        >
                          <Icon className="w-4 h-4 mr-1.5" />
                          {badge}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Artworks Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Submitted Artworks</h3>
                {profile.artworks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ImageOff className="w-12 h-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No artworks submitted yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.artworks.map((artwork, index) => (
                      <button
                        key={Number(artwork.id)}
                        onClick={() => handleImageClick(index)}
                        className="group relative aspect-video overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-all duration-300 shadow-md hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.artworkTitle}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {artwork.artworkTitle}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-primary" />
                              <span className="text-xs text-muted-foreground">{Number(artwork.popularity)} votes</span>
                            </div>
                          </div>
                        </div>
                        {artwork.featured && (
                          <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox for viewing artworks */}
      <GalleryLightbox
        items={lightboxItems}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={currentImageIndex}
        onNavigate={setCurrentImageIndex}
      />
    </>
  );
}
