import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { clans } from '../../data/clans';
import { ClanResult } from '../../data/clanQuizResults';

interface ResultsCardProps {
  result: ClanResult;
}

export const ResultsCard = forwardRef<HTMLDivElement, ResultsCardProps>(
  ({ result }, ref) => {
    const clanData = clans.find(c => c.id === result.id);
    
    return (
      <Card 
        ref={ref}
        className="relative overflow-hidden border-2 bg-card/95 backdrop-blur-sm max-w-2xl mx-auto"
        style={{
          borderColor: clanData?.accentColor || 'oklch(var(--border))'
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${clanData?.accentColor || 'oklch(var(--primary))'} 0%, transparent 70%)`
          }}
        />
        
        <CardHeader className="relative text-center space-y-4 pb-4">
          {clanData?.sigilPath && (
            <div className="flex justify-center">
              <div 
                className="w-32 h-32 rounded-full p-4 relative"
                style={{
                  background: `radial-gradient(circle, ${clanData.accentColor}20 0%, transparent 70%)`
                }}
              >
                <img 
                  src={clanData.sigilPath} 
                  alt={`${result.name} sigil`}
                  className="w-full h-full object-contain animate-pulse-glow"
                />
              </div>
            </div>
          )}
          
          <div>
            <CardTitle className="text-4xl font-black mb-2" style={{ color: clanData?.accentColor }}>
              {result.name}
            </CardTitle>
            {result.isSecret && (
              <Badge variant="outline" className="border-accent text-accent animate-pulse-glow">
                Secret Rare Result
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-4 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">Your Personality</h3>
            <p className="text-base text-foreground/90 leading-relaxed">
              {result.personality}
            </p>
          </div>
          
          {clanData && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {clanData.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ResultsCard.displayName = 'ResultsCard';
