import { forwardRef, useCallback, KeyboardEvent } from 'react';
import { worldMapLocations, WorldMapLocation } from '../../data/worldMapLocations';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface WorldMapHotspotsOverlayProps {
  onLocationClick: (location: WorldMapLocation, element: SVGPathElement) => void;
}

export const WorldMapHotspotsOverlay = forwardRef<
  Map<string, SVGPathElement>,
  WorldMapHotspotsOverlayProps
>(({ onLocationClick }, hotspotsRef) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<SVGPathElement>, location: WorldMapLocation) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onLocationClick(location, event.currentTarget);
      }
    },
    [onLocationClick]
  );

  const setHotspotRef = useCallback(
    (id: string, element: SVGPathElement | null) => {
      if (hotspotsRef && typeof hotspotsRef !== 'function') {
        if (element) {
          hotspotsRef.current?.set(id, element);
        } else {
          hotspotsRef.current?.delete(id);
        }
      }
    },
    [hotspotsRef]
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="hotspot-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {worldMapLocations.map((location) => (
        <path
          key={location.id}
          ref={(el) => setHotspotRef(location.id, el)}
          d={location.shape}
          className={`world-map-hotspot pointer-events-auto cursor-pointer focus:outline-none ${
            !prefersReducedMotion ? 'transition-all duration-300' : ''
          }`}
          onClick={() => {
            const element = hotspotsRef && typeof hotspotsRef !== 'function' 
              ? hotspotsRef.current?.get(location.id) 
              : null;
            if (element) {
              onLocationClick(location, element);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, location)}
          tabIndex={0}
          role="button"
          aria-label={`View lore for ${location.name}`}
          style={{
            filter: prefersReducedMotion ? 'none' : 'url(#hotspot-glow)',
          }}
        />
      ))}
    </svg>
  );
});

WorldMapHotspotsOverlay.displayName = 'WorldMapHotspotsOverlay';
