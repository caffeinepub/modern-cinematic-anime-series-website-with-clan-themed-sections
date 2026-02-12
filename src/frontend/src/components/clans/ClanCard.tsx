import { type Clan } from '../../data/clans';
import { ClanBadge } from './ClanBadge';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ClanCardProps {
  clan: Clan;
  index: number;
  isVisible: boolean;
}

export function ClanCard({ clan, index, isVisible }: ClanCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={`group relative bg-card/60 backdrop-blur-md border-2 rounded-2xl overflow-hidden hover:border-opacity-100 transition-all duration-500 ${
        !prefersReducedMotion && isVisible ? 'animate-fade-scale' : isVisible ? 'opacity-100' : 'opacity-0'
      } ${!prefersReducedMotion ? 'hover:shadow-glow-lg hover:scale-105' : 'hover:scale-102'}`}
      style={{
        animationDelay: !prefersReducedMotion ? `${index * 0.15}s` : '0s',
        borderColor: clan.accentColor
      }}
    >
      {/* Dramatic glow effect on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          !prefersReducedMotion ? clan.glowClass : ''
        }`}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${clan.accentColor}30 0%, transparent 70%)`
        }}
      />

      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${clan.accentColor}20 0%, transparent 50%, ${clan.accentColor}20 100%)`
        }}
      />

      {/* Content */}
      <div className="relative p-8">
        {/* Sigil Image */}
        <div className="mb-8 flex justify-center">
          <div
            className={`relative w-40 h-40 rounded-full p-6 transition-all duration-500 ${
              !prefersReducedMotion ? 'group-hover:scale-110 group-hover:animate-float-slow' : 'group-hover:scale-105'
            }`}
            style={{
              backgroundColor: `${clan.accentColor}20`,
              boxShadow: `0 0 40px ${clan.accentColor}50, inset 0 0 20px ${clan.accentColor}30`
            }}
          >
            <img
              src={clan.sigilPath}
              alt={`${clan.name} sigil`}
              className="w-full h-full object-contain"
              style={{
                filter: `drop-shadow(0 0 16px ${clan.accentColor})`
              }}
            />
            
            {/* Rotating ring effect */}
            <div
              className={`absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${!prefersReducedMotion ? 'group-hover:animate-spin' : ''}`}
              style={{
                borderColor: clan.accentColor,
                borderStyle: 'dashed',
                animationDuration: '8s'
              }}
            />
          </div>
        </div>

        {/* Clan Badge */}
        <div className="mb-6 flex justify-center">
          <ClanBadge clan={clan} />
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-base leading-relaxed text-center">
          {clan.description}
        </p>
      </div>

      {/* Dramatic bottom accent line */}
      <div
        className={`h-2 w-full transition-all duration-500 ${!prefersReducedMotion ? 'group-hover:h-3' : ''}`}
        style={{
          background: `linear-gradient(to right, transparent, ${clan.accentColor}, transparent)`
        }}
      />
    </div>
  );
}
