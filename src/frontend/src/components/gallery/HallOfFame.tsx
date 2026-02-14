import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExternalLink, Sparkles } from 'lucide-react';
import { GalleryLightbox } from './GalleryLightbox';

// Mock data - in production this would come from backend
const HALL_OF_FAME_ENTRIES = [
  {
    artistName: 'SakuraArtist',
    featuredArtworkUrl: '/assets/generated/gallery-character-01.dim_1280x720.png',
    recognitionMessage: 'A visionary artist who brought the world of Whispers Of The White Moon to life with stunning character portraits and breathtaking landscapes. Their dedication and talent have inspired countless fans.',
    achievements: ['First Featured Artist', 'Community Choice Award 2025', '50+ Submissions'],
    creditLink: 'https://example.com/sakuraartist',
  },
  {
    artistName: 'MoonlightCreator',
    featuredArtworkUrl: '/assets/generated/gallery-fight-01.dim_1280x720.png',
    recognitionMessage: 'Master of dynamic action scenes and epic battles. Their work captures the intensity and emotion of the most pivotal moments in the series.',
    achievements: ['Action Scene Specialist', 'Most Popular Artwork 2025', 'Legendary Creator Badge'],
    creditLink: 'https://example.com/moonlightcreator',
  },
];

export function HallOfFame() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Transform entries for lightbox
  const lightboxItems = HALL_OF_FAME_ENTRIES.map((entry) => ({
    id: entry.artistName,
    title: entry.artistName,
    category: 'Hall of Fame',
    src: entry.featuredArtworkUrl,
    alt: `${entry.artistName} - Featured Artwork`,
  }));

  return (
    <>
      <div className="space-y-8">
        {HALL_OF_FAME_ENTRIES.map((entry, index) => (
          <Card
            key={entry.artistName}
            className="group relative overflow-hidden border-2 border-accent/50 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10 shadow-glow-lg hover:shadow-glow-xl transition-all duration-500"
          >
            {/* Spotlight glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Legendary badge */}
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0 shadow-glow text-sm py-1.5 px-3">
                <Sparkles className="w-4 h-4 mr-1" />
                Hall of Fame
              </Badge>
            </div>

            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Featured Artwork */}
                <button
                  onClick={() => handleImageClick(index)}
                  className="relative aspect-video md:aspect-auto overflow-hidden group/image focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <img
                    src={entry.featuredArtworkUrl}
                    alt={`${entry.artistName} - Featured Artwork`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm text-accent font-semibold">Click to view full size</p>
                    </div>
                  </div>
                  {/* Spotlight corner accent */}
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-accent/30 to-transparent" />
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/30 to-transparent" />
                </button>

                {/* Artist Info */}
                <div className="p-8 flex flex-col justify-center space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                      {entry.artistName}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {entry.recognitionMessage}
                    </p>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                      Achievements & Awards
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.achievements.map((achievement) => (
                        <Badge
                          key={achievement}
                          variant="outline"
                          className="bg-primary/10 border-primary/30 text-primary"
                        >
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Credit Link */}
                  {entry.creditLink && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-accent/50 hover:bg-accent/10 hover:border-accent"
                      >
                        <a
                          href={entry.creditLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Artist Profile
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            {/* Premium border glow */}
            <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/50 rounded-lg transition-all duration-500 pointer-events-none" />
          </Card>
        ))}
      </div>

      {/* Lightbox for viewing featured artworks */}
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
