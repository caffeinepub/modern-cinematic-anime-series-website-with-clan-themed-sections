import { useState } from 'react';
import { useGetArtistLeaderboard } from '../../hooks/useQueries';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Trophy, Award, Star, Sparkles, TrendingUp } from 'lucide-react';
import { ArtistProfileDialog } from './ArtistProfileDialog';

const BADGE_CONFIG = {
  'Rising Artist': { icon: TrendingUp, color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/30' },
  'Community Favorite': { icon: Star, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/30' },
  'Monthly Champion': { icon: Award, color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/30' },
  'Legendary Creator': { icon: Sparkles, color: 'text-accent', bgColor: 'bg-accent/10 border-accent/30' },
};

const RANK_COLORS = [
  'from-yellow-400 to-yellow-600', // 1st
  'from-gray-300 to-gray-500', // 2nd
  'from-orange-400 to-orange-600', // 3rd
];

export function ArtistLeaderboard() {
  const { data: leaderboard = [], isLoading, error } = useGetArtistLeaderboard();
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load leaderboard
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">No artists yet. Be the first to submit!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {leaderboard.map((entry) => {
          const isTopThree = entry.rank <= 3;
          const rankGradient = RANK_COLORS[entry.rank - 1];

          return (
            <Card
              key={entry.artistName}
              className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-glow-lg ${
                isTopThree
                  ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5'
                  : 'border-border/50 bg-card/50'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Rank Badge */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                      isTopThree
                        ? `bg-gradient-to-br ${rankGradient} text-white shadow-glow`
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {entry.rank <= 3 ? (
                      <Trophy className="w-8 h-8" />
                    ) : (
                      <span>#{entry.rank}</span>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground truncate">
                        {entry.artistName}
                      </h3>
                      {isTopThree && (
                        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                          Top {entry.rank}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">{entry.totalVotes}</span>
                        <span>votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-accent" />
                        <span className="font-semibold text-foreground">{entry.submittedCount}</span>
                        <span>artworks</span>
                      </div>
                      {entry.featuredCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="font-semibold text-foreground">{entry.featuredCount}</span>
                          <span>featured</span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    {entry.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.badges.map((badge) => {
                          const config = BADGE_CONFIG[badge];
                          const Icon = config.icon;
                          return (
                            <Badge
                              key={badge}
                              variant="outline"
                              className={`${config.bgColor} ${config.color} border`}
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {badge}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedArtist(entry.artistName)}
                    className="flex-shrink-0 border-primary/50 hover:bg-primary/10 hover:border-primary"
                  >
                    View Profile
                  </Button>
                </div>

                {/* Glow effect for top 3 */}
                {isTopThree && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Artist Profile Dialog */}
      {selectedArtist && (
        <ArtistProfileDialog
          artistName={selectedArtist}
          open={!!selectedArtist}
          onOpenChange={(open) => !open && setSelectedArtist(null)}
        />
      )}
    </>
  );
}
