import { type Character } from '../../data/characters';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { User } from 'lucide-react';
import { useState } from 'react';

interface CharacterCardProps {
  character: Character;
  index: number;
  isVisible: boolean;
}

export function CharacterCard({ character, index, isVisible }: CharacterCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [imageError, setImageError] = useState(false);

  // Get clan color based on clan name
  const getClanColor = (clan: string): string => {
    const clanMap: Record<string, string> = {
      'Moon Clan': 'oklch(var(--clan-moon))',
      'Sun Clan': 'oklch(var(--clan-sun))',
      'Fire Clan': 'oklch(var(--clan-fire))',
      'Water Clan': 'oklch(var(--clan-water))',
      'Lightning Clan': 'oklch(var(--clan-lightning))',
      'Earth Clan': 'oklch(var(--clan-earth))',
      'Wind Clan': 'oklch(var(--primary))',
      'Unknown': 'oklch(var(--muted-foreground))'
    };
    return clanMap[clan] || 'oklch(var(--primary))';
  };

  const clanColor = getClanColor(character.clan);
  const hasPortrait = character.portraitUrl && !imageError;

  return (
    <div
      className={`group relative bg-card border-2 rounded-xl overflow-hidden hover:border-opacity-100 transition-all duration-300 ${
        !prefersReducedMotion && isVisible ? 'animate-fade-in-up' : isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        animationDelay: !prefersReducedMotion ? `${index * 0.1}s` : '0s',
        borderColor: clanColor
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${clanColor}20 0%, transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="relative p-6 flex flex-col h-full">
        {/* Portrait */}
        <div className="mb-4 flex justify-center">
          <div
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${
              !prefersReducedMotion ? 'group-hover:scale-110' : 'group-hover:scale-105'
            }`}
            style={{
              backgroundColor: `${clanColor}15`,
              boxShadow: `0 0 20px ${clanColor}40`
            }}
          >
            {hasPortrait ? (
              <img
                src={character.portraitUrl}
                alt={character.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <User
                className="w-12 h-12"
                style={{ color: clanColor }}
              />
            )}
          </div>
        </div>

        {/* Character Name */}
        <h3 className="text-2xl font-bold text-center mb-2" style={{ color: clanColor }}>
          {character.name}
        </h3>

        {/* Clan Badge */}
        <div className="mb-4 flex justify-center">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${clanColor}20`,
              color: clanColor,
              border: `1px solid ${clanColor}40`
            }}
          >
            {character.clan}
          </div>
        </div>

        {/* Character Details */}
        <div className="space-y-3 flex-1">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1">Personality</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {character.personality}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-1">Power</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {character.power}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-1">Role</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {character.role}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-1 w-full transition-all duration-300 group-hover:h-2"
        style={{
          background: `linear-gradient(to right, transparent, ${clanColor}, transparent)`
        }}
      />
    </div>
  );
}
