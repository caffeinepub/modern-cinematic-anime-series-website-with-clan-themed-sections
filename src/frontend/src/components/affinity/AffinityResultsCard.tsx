import { forwardRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AffinityCharacter } from '../../data/affinityCharacters';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AffinityResultsCardProps {
  character: AffinityCharacter;
  soulResonance: number;
}

export const AffinityResultsCard = forwardRef<HTMLDivElement, AffinityResultsCardProps>(
  ({ character, soulResonance }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [imageError, setImageError] = useState(false);
    
    return (
      <Card 
        ref={ref}
        className={`relative overflow-hidden border-2 border-primary bg-card/95 backdrop-blur-sm max-w-3xl mx-auto ${
          !prefersReducedMotion ? 'destiny-reveal-card' : ''
        }`}
      >
        {/* Destiny sigil background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img 
            src="/assets/generated/affinity-destiny-sigil.dim_1024x1024.png"
            alt=""
            className={`w-full h-full object-cover ${!prefersReducedMotion ? 'animate-pulse-glow' : ''}`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        {/* Radial glow effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, oklch(var(--primary)) 0%, transparent 70%)'
          }}
        />
        
        <CardHeader className="relative text-center space-y-4 pb-4">
          {/* Character Portrait */}
          <div className="flex justify-center">
            <div className={`relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary ${
              !prefersReducedMotion ? 'shadow-glow-xl' : 'shadow-glow'
            }`}>
              {!imageError ? (
                <img 
                  src={character.portraitPath}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <div className="text-6xl font-black text-primary">
                    {character.name.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <CardTitle className="text-5xl font-black mb-3 text-primary text-glow">
              {character.name}
            </CardTitle>
            <Badge 
              variant="outline" 
              className={`border-accent text-accent text-lg px-4 py-1 ${
                !prefersReducedMotion ? 'animate-pulse-glow' : ''
              }`}
            >
              Your Soul Resonance: {soulResonance}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          {/* Personality Description */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-primary">Personality</h3>
            <p className="text-base text-foreground/90 leading-relaxed">
              {character.personality}
            </p>
          </div>
          
          {/* Why You Match */}
          <div className="space-y-2 pt-4 border-t border-border/50">
            <h3 className="text-xl font-bold text-primary">Why You Match</h3>
            <p className="text-base text-foreground/90 leading-relaxed">
              {character.whyYouMatch}
            </p>
          </div>
          
          {/* Fighting Style & Abilities */}
          <div className="space-y-2 pt-4 border-t border-border/50">
            <h3 className="text-xl font-bold text-primary">Fighting Style & Abilities</h3>
            <p className="text-base text-foreground/90 leading-relaxed">
              {character.fightingStyle}
            </p>
          </div>
          
          {/* Role in the Story */}
          <div className="space-y-2 pt-4 border-t border-border/50">
            <h3 className="text-xl font-bold text-primary">Role in the Story</h3>
            <p className="text-base text-foreground/90 leading-relaxed">
              {character.roleInStory}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

AffinityResultsCard.displayName = 'AffinityResultsCard';
