import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { useGetAllCharacters } from '../../hooks/useQueries';
import { CharacterCard } from '../characters/CharacterCard';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { decodeCharacterMetadata } from '../../utils/adminContentAdapters';

export function CharactersSection() {
  const { ref, isVisible } = useRevealOnScroll();
  const { data: backendCharacters = [], isLoading, error } = useGetAllCharacters();

  // Transform backend characters to match the expected format
  const characters = backendCharacters.map((char) => {
    const { bio, metadata } = decodeCharacterMetadata(char.bio);
    return {
      id: char.id.toString(),
      name: char.name,
      clan: metadata.clan || 'Unknown Clan',
      personality: metadata.personality || bio,
      power: metadata.power || '',
      role: char.role,
    };
  });

  return (
    <section
      id="characters"
      ref={ref}
      className={`py-24 px-4 bg-gradient-to-b from-background via-background/95 to-background ${
        isVisible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Characters
          </span>
        </h2>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
          Meet the legendary warriors, mystics, and leaders who shape the destiny of Whispers Of The White Moon.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load characters: {error.message}</AlertDescription>
          </Alert>
        ) : characters.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No characters available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {characters.map((character, index) => (
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
    </section>
  );
}
