import { type Clan } from '../../data/clans';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ClanBadgeProps {
  clan: Clan;
}

export function ClanBadge({ clan }: ClanBadgeProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: `${clan.accentColor}15`,
        borderColor: `${clan.accentColor}50`,
        color: clan.accentColor
      }}
    >
      <div
        className={`w-2 h-2 rounded-full ${!prefersReducedMotion ? 'animate-badge-pulse' : ''}`}
        style={{
          backgroundColor: clan.accentColor,
          boxShadow: `0 0 10px ${clan.accentColor}`
        }}
      />
      <span className="font-semibold text-sm">{clan.name}</span>
    </div>
  );
}

