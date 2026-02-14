import { useState } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { useGetAllGalleryItems, useGetFeaturedGalleryItems, useFilterGalleryItems, useIsCallerAdmin, useGetAllCharacters, useGetAllClans, useIncrementGalleryItemViewCount } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { GalleryGrid } from '../gallery/GalleryGrid';
import { GalleryLightbox } from '../gallery/GalleryLightbox';
import { GalleryUploadDialog } from '../gallery/GalleryUploadDialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Plus, ImageOff, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { decodeGalleryMetadata } from '../../utils/adminContentAdapters';
import { galleryItems as staticGalleryItems } from '../../data/gallery';

export function GallerySection() {
  const { ref, isVisible } = useRevealOnScroll();
  const { data: backendGalleryItems = [], isLoading, error } = useGetAllGalleryItems();
  const { data: featuredItems = [] } = useGetFeaturedGalleryItems();
  const { data: characters = [] } = useGetAllCharacters();
  const { data: clans = [] } = useGetAllClans();
  const filterMutation = useFilterGalleryItems();
  const incrementViewMutation = useIncrementGalleryItemViewCount();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('all');
  const [selectedClanId, setSelectedClanId] = useState<string>('all');
  const [sortByPopularity, setSortByPopularity] = useState(false);
  
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  // Apply filters
  const [filteredGalleryItems, setFilteredGalleryItems] = useState<typeof backendGalleryItems>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Effect to apply filters
  useState(() => {
    const applyFilters = async () => {
      if (selectedCharacterId === 'all' && selectedClanId === 'all' && !sortByPopularity) {
        setFilteredGalleryItems(backendGalleryItems);
        return;
      }

      setIsFiltering(true);
      try {
        const characterIds = selectedCharacterId === 'all' ? [] : [BigInt(selectedCharacterId)];
        const clanIds = selectedClanId === 'all' ? [] : [BigInt(selectedClanId)];
        
        const result = await filterMutation.mutateAsync({
          characterIds,
          clanIds,
          sortByPopularity,
          featuredOnly: false,
        });
        
        setFilteredGalleryItems(result);
      } catch (err) {
        console.error('Filter error:', err);
        setFilteredGalleryItems(backendGalleryItems);
      } finally {
        setIsFiltering(false);
      }
    };

    applyFilters();
  });

  // Use filtered items or all items
  const displayItems = (selectedCharacterId !== 'all' || selectedClanId !== 'all' || sortByPopularity)
    ? filteredGalleryItems
    : backendGalleryItems;

  // Transform backend gallery items to match the expected format
  const galleryItems = displayItems.length > 0
    ? displayItems.map((item) => {
        const { description, metadata } = decodeGalleryMetadata(item.description || '');
        return {
          id: item.id.toString(),
          title: item.title,
          artistName: item.artistName,
          artworkTitle: item.artworkTitle,
          description: item.description,
          creditLink: item.creditLink,
          category: (metadata.category || 'Concept Art') as 'Concept Art' | 'Fight Scenes' | 'Character Designs',
          src: item.imageUrl,
          alt: metadata.alt || item.title,
          featured: item.featured,
        };
      })
    : staticGalleryItems;

  // Transform featured items
  const featuredGalleryItems = featuredItems.map((item) => {
    const { description, metadata } = decodeGalleryMetadata(item.description || '');
    return {
      id: item.id.toString(),
      title: item.title,
      artistName: item.artistName,
      artworkTitle: item.artworkTitle,
      description: item.description,
      creditLink: item.creditLink,
      category: (metadata.category || 'Concept Art') as 'Concept Art' | 'Fight Scenes' | 'Character Designs',
      src: item.imageUrl,
      alt: metadata.alt || item.title,
      featured: item.featured,
    };
  });

  const handleImageClick = (index: number, isFeatured: boolean = false) => {
    // Increment view count
    const item = isFeatured ? featuredGalleryItems[index] : galleryItems[index];
    if (item && item.id) {
      incrementViewMutation.mutate(BigInt(item.id));
    }

    // Find the index in the full gallery items array
    if (isFeatured) {
      const globalIndex = galleryItems.findIndex((gi) => gi.id === featuredGalleryItems[index].id);
      setCurrentImageIndex(globalIndex >= 0 ? globalIndex : 0);
    } else {
      setCurrentImageIndex(index);
    }
    setLightboxOpen(true);
  };

  const handleNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  const showAdminButton = identity && isAdmin;
  const isEmpty = galleryItems.length === 0;
  const hasFeatured = featuredGalleryItems.length > 0;

  return (
    <section
      id="gallery"
      ref={ref}
      className={`py-24 px-4 bg-gradient-to-b from-background via-background/95 to-background ${
        isVisible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          {showAdminButton && (
            <Button
              onClick={() => setUploadDialogOpen(true)}
              size="icon"
              className="bg-background/80 backdrop-blur-sm border-2 border-primary/50 hover:border-primary hover:bg-primary/10 shadow-glow transition-all duration-300"
            >
              <Plus className="w-5 h-5 text-primary" />
            </Button>
          )}
        </div>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Explore stunning artwork, epic battles, and character designs from Whispers Of The White Moon.
        </p>

        {/* Submission Guidelines */}
        <Card className="mb-12 border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Submission Guidelines</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Artwork must be appropriate and respectful</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Artwork must be original or credited properly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>The creator team may review and approve submissions before posting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Submissions may be featured on the website or social media</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load gallery: {error.message}</AlertDescription>
          </Alert>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ImageOff className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground">No gallery images yet.</p>
          </div>
        ) : (
          <>
            {/* Featured Fan Art Section */}
            {hasFeatured && (
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-center mb-8">
                  <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                    Featured Fan Art
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredGalleryItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleImageClick(index, true)}
                      className="group relative aspect-video overflow-hidden rounded-lg border-2 border-accent/50 bg-card hover:border-accent transition-all duration-300 shadow-glow-lg hover:shadow-glow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-lg font-bold text-foreground mb-1">{item.artworkTitle}</h4>
                          <p className="text-sm text-accent font-medium">by {item.artistName}</p>
                          {item.creditLink && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">{item.creditLink}</p>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap gap-4 mb-8 items-center justify-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Character:</label>
                <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Characters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Characters</SelectItem>
                    {characters.map((char) => (
                      <SelectItem key={char.id.toString()} value={char.id.toString()}>
                        {char.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Clan:</label>
                <Select value={selectedClanId} onValueChange={setSelectedClanId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Clans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clans</SelectItem>
                    {clans.map((clan) => (
                      <SelectItem key={clan.id.toString()} value={clan.id.toString()}>
                        {clan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant={sortByPopularity ? 'default' : 'outline'}
                onClick={() => setSortByPopularity(!sortByPopularity)}
                className="min-w-[140px]"
              >
                {sortByPopularity ? 'Most Popular' : 'Sort by Popular'}
              </Button>

              {(selectedCharacterId !== 'all' || selectedClanId !== 'all' || sortByPopularity) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCharacterId('all');
                    setSelectedClanId('all');
                    setSortByPopularity(false);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {isFiltering ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="aspect-video w-full" />
                ))}
              </div>
            ) : (
              <>
                <GalleryGrid items={galleryItems} onImageClick={(index) => handleImageClick(index, false)} />
                <GalleryLightbox
                  items={galleryItems}
                  isOpen={lightboxOpen}
                  onClose={() => setLightboxOpen(false)}
                  currentIndex={currentImageIndex}
                  onNavigate={handleNavigate}
                />
              </>
            )}
          </>
        )}
      </div>

      <GalleryUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </section>
  );
}
