import { useState, useRef } from 'react';
import { worldMapLocations, WorldMapLocation } from '../../data/worldMapLocations';
import { WorldMapLoreDialog } from './WorldMapLoreDialog';
import { WorldMapHotspotsOverlay } from './WorldMapHotspotsOverlay';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function WorldMapSection() {
  const [selectedLocation, setSelectedLocation] = useState<WorldMapLocation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hotspotRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleHotspotClick = (location: WorldMapLocation, element: SVGPathElement) => {
    setSelectedLocation(location);
    setDialogOpen(true);
    // Store the triggering element for focus return
    hotspotRefs.current.set('last-activated', element);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Return focus to the last activated hotspot
    const lastElement = hotspotRefs.current.get('last-activated');
    if (lastElement) {
      setTimeout(() => lastElement.focus(), 100);
    }
  };

  return (
    <div className="relative py-16 md:py-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-card/20 to-background/50" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={sectionRef}
          className={`text-center mb-12 transition-all duration-800 ${
            !prefersReducedMotion && isVisible ? 'animate-fade-in-up' : isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className={`text-4xl md:text-6xl font-black mb-6 ${!prefersReducedMotion ? 'text-glow' : ''}`}>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              World Map
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore the territories and discover the lore of each region
          </p>
        </div>

        {/* Map container */}
        <div
          className={`relative max-w-6xl mx-auto transition-all duration-1000 ${
            !prefersReducedMotion && isVisible ? 'animate-fade-in' : isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Map image with hotspots overlay */}
          <div className="relative w-full rounded-lg overflow-hidden border-2 border-border/50 shadow-2xl">
            <img
              src="/assets/ChatGPT Image Feb 4, 2026, 08_36_58 AM.png"
              alt="World map showing clan territories including Frozen Tides, Cincthed Sands, Stormlands, Ashen Peaks, Azure Isles, Emerald Vale, and Whispering Sea"
              className="w-full h-auto"
            />

            {/* SVG hotspots overlay */}
            <WorldMapHotspotsOverlay
              ref={hotspotRefs}
              onLocationClick={handleHotspotClick}
            />
          </div>

          {/* Legend */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Click on any region to learn more about its history and significance</p>
          </div>
        </div>
      </div>

      {/* Lore dialog */}
      <WorldMapLoreDialog
        location={selectedLocation}
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleDialogClose();
          } else {
            setDialogOpen(open);
          }
        }}
      />
    </div>
  );
}
