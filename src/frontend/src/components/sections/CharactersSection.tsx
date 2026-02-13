import { useState } from 'react';
import { useGetAllCharacters } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { CharacterCard } from '../characters/CharacterCard';
import { CreateCharacterDialog } from '../characters/CreateCharacterDialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Plus } from 'lucide-react';
import { decodeCharacterMetadata } from '../../utils/adminContentAdapters';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

export function CharactersSection() {
  const { data: characters = [], isLoading, error } = useGetAllCharacters();
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  const isAuthenticated = !!identity;
  const showAdminButton = isAuthenticated && isAdmin;

  const transformedCharacters = characters.map((character) => {
    const { bio, metadata } = decodeCharacterMetadata(character.bio);
    return {
      id: character.id.toString(),
      name: character.name,
      clan: metadata.clan || 'Unknown Clan',
      personality: metadata.personality || '',
      power: metadata.power || '',
      role: character.role,
      portraitUrl: character.portraitUrl || undefined,
    };
  });

  return (
    <section
      id="characters"
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,oklch(var(--accent)/0.06),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-glow">Characters</h2>
            {showAdminButton && (
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the heroes and villains of Whispers Of The White Moon
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load characters: {error.message}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transformedCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}
      </div>

      <CreateCharacterDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </section>
  );
}
