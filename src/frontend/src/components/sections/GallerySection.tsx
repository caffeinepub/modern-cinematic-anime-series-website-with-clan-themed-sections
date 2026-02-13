import { useState } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { useGetAllGalleryItems, useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { GalleryGrid } from '../gallery/GalleryGrid';
import { GalleryLightbox } from '../gallery/GalleryLightbox';
import { GalleryUploadDialog } from '../gallery/GalleryUploadDialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Plus, ImageOff } from 'lucide-react';
import { decodeGalleryMetadata } from '../../utils/adminContentAdapters';
import { galleryItems as staticGalleryItems } from '../../data/gallery';

export function GallerySection() {
  const { ref, isVisible } = useRevealOnScroll();
  const { data: backendGalleryItems = [], isLoading, error } = useGetAllGalleryItems();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  // Transform backend gallery items to match the expected format
  const galleryItems = backendGalleryItems.length > 0
    ? backendGalleryItems.map((item) => {
        const { description, metadata } = decodeGalleryMetadata(item.description);
        return {
          id: item.id.toString(),
          title: item.title,
          category: (metadata.category || 'Concept Art') as 'Concept Art' | 'Fight Scenes' | 'Character Designs',
          src: item.imageUrl,
          alt: metadata.alt || item.title,
        };
      })
    : staticGalleryItems; // Fallback to static gallery if no backend data

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  const showAdminButton = identity && isAdmin;
  const isEmpty = galleryItems.length === 0;

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
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
          Explore stunning artwork, epic battles, and character designs from Whispers Of The White Moon.
        </p>

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
            <GalleryGrid items={galleryItems} onImageClick={handleImageClick} />
            <GalleryLightbox
              items={galleryItems}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              currentIndex={currentImageIndex}
              onNavigate={handleNavigate}
            />
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
