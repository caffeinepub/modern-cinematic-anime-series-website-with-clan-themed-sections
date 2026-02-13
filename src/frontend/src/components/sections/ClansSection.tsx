import { useGetAllClans } from '../../hooks/useQueries';
import { ClanCard } from '../clans/ClanCard';
import { WorldMapSection } from './WorldMapSection';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { decodeClanMetadata, getClanStyling } from '../../utils/adminContentAdapters';
import { clans as staticClans } from '../../data/clans';

export function ClansSection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { data: backendClans = [], isLoading, error } = useGetAllClans();

  // Transform backend clans to match the expected format, merging with static styling
  const clans = backendClans.length > 0 
    ? backendClans.map((clan) => {
        const { description, metadata } = decodeClanMetadata(clan.description);
        const styling = getClanStyling(clan.name);
        return {
          id: clan.id.toString(),
          name: clan.name,
          description,
          accentColor: metadata.accentColor || styling.accentColor,
          glowClass: metadata.glowClass || styling.glowClass,
          sigilPath: metadata.sigilPath || styling.sigilPath,
        };
      })
    : staticClans; // Fallback to static clans if no backend data

  return (
    <section id="clans" className="relative py-32 md:py-40 layered-bg overflow-hidden">
      {/* Dramatic background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={sectionRef}
          className={`text-center mb-20 transition-all duration-800 ${
            !prefersReducedMotion && isVisible ? 'animate-fade-in-up' : isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className={`text-5xl md:text-7xl font-black mb-8 ${!prefersReducedMotion ? 'text-glow' : ''}`}>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Clans
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            Each clan wields unique elemental powers passed down through generations. Discover their strengths, their legends, and their role in the coming war.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load clans: {error.message}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {clans.map((clan, index) => (
              <ClanCard
                key={clan.id}
                clan={clan}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}

        {/* World Map Section integrated within Clans */}
        <div className="mt-32">
          <WorldMapSection />
        </div>
      </div>
    </section>
  );
}
