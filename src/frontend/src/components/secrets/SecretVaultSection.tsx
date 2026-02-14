import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Lock, Unlock, Eye, Image as ImageIcon, FileText, RotateCcw } from 'lucide-react';
import { loreFragments, hiddenCharacterInfo, bonusArtwork } from '../../data/secretLore';
import { loadProgress, resetProgress, SecretProgress } from './secretProgress';

export function SecretVaultSection() {
  const [progress, setProgress] = useState<SecretProgress>(loadProgress());
  const [selectedLore, setSelectedLore] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);

  useEffect(() => {
    // Refresh progress from storage
    setProgress(loadProgress());
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all discovered secrets? This cannot be undone.')) {
      resetProgress();
      setProgress(loadProgress());
    }
  };

  const selectedLoreData = loreFragments.find(f => f.id === selectedLore);
  const selectedCharacterData = hiddenCharacterInfo.find(c => c.id === selectedCharacter);
  const selectedArtworkData = bonusArtwork.find(a => a.id === selectedArtwork);

  const foundCount = progress.foundFragments.length;
  const totalFragments = loreFragments.length;
  const completionPercentage = Math.round((foundCount / totalFragments) * 100);

  return (
    <section id="vault" className="relative py-24 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(var(--primary))_0%,transparent_50%)] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4 animate-pulse-glow">
            <Unlock className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Secret Vault</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-glow">
            Hidden Archives
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover the secrets hidden throughout the world of Whispers Of The White Moon
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Discovery Progress</span>
              <span className="text-sm text-muted-foreground">{foundCount}/{totalFragments}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lore Fragments */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Lore Fragments
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {loreFragments.map((fragment) => {
              const isFound = progress.foundFragments.includes(fragment.id);
              return (
                <Card 
                  key={fragment.id}
                  className={`border-2 transition-all duration-300 ${
                    isFound 
                      ? 'border-primary/40 bg-card/95 backdrop-blur-sm hover:border-primary cursor-pointer' 
                      : 'border-muted bg-muted/50'
                  }`}
                  onClick={() => isFound && setSelectedLore(fragment.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        {isFound ? (
                          <>
                            <Unlock className="w-5 h-5 text-primary" />
                            {fragment.title}
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground">???</span>
                          </>
                        )}
                      </CardTitle>
                      {isFound && (
                        <Badge variant="outline" className="border-primary text-primary">
                          Found
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isFound ? (
                      <p className="text-foreground/80 line-clamp-3">{fragment.content}</p>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">
                        {fragment.unlockHint}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Hidden Character Info */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Eye className="w-8 h-8 text-accent" />
            Hidden Character Secrets
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {hiddenCharacterInfo.map((character) => {
              const isUnlocked = progress.unlockedCharacters.includes(character.id);
              return (
                <Card 
                  key={character.id}
                  className={`border-2 transition-all duration-300 ${
                    isUnlocked 
                      ? 'border-accent/40 bg-card/95 backdrop-blur-sm hover:border-accent cursor-pointer' 
                      : 'border-muted bg-muted/50'
                  }`}
                  onClick={() => isUnlocked && setSelectedCharacter(character.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {isUnlocked ? character.characterName : '???'}
                        </CardTitle>
                        {isUnlocked && (
                          <p className="text-sm text-accent mt-1">{character.secretTitle}</p>
                        )}
                      </div>
                      {isUnlocked ? (
                        <Badge variant="outline" className="border-accent text-accent">
                          Unlocked
                        </Badge>
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isUnlocked ? (
                      <p className="text-foreground/80 line-clamp-3">{character.revealedInfo}</p>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">
                        Locked - Discover this character's hidden truth
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bonus Artwork */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-primary" />
            Bonus Artwork Gallery
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bonusArtwork.map((artwork) => {
              const isUnlocked = progress.unlockedArtwork.includes(artwork.id);
              return (
                <Card 
                  key={artwork.id}
                  className={`border-2 transition-all duration-300 overflow-hidden ${
                    isUnlocked 
                      ? 'border-primary/40 bg-card/95 backdrop-blur-sm hover:border-primary cursor-pointer' 
                      : 'border-muted bg-muted/50'
                  }`}
                  onClick={() => isUnlocked && setSelectedArtwork(artwork.id)}
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {isUnlocked ? (
                      <img 
                        src={artwork.path} 
                        alt={artwork.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Lock className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold mb-1">
                      {isUnlocked ? artwork.title : 'Locked Artwork'}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {isUnlocked ? artwork.description : 'Unlock to reveal'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Progress
          </Button>
        </div>
      </div>

      {/* Lore Dialog */}
      <Dialog open={!!selectedLore} onOpenChange={() => setSelectedLore(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedLoreData?.title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="prose prose-invert max-w-none">
              <p className="text-base text-foreground/90 leading-relaxed">
                {selectedLoreData?.content}
              </p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Character Dialog */}
      <Dialog open={!!selectedCharacter} onOpenChange={() => setSelectedCharacter(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedCharacterData?.characterName}
            </DialogTitle>
            <p className="text-accent font-semibold">{selectedCharacterData?.secretTitle}</p>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="prose prose-invert max-w-none">
              <p className="text-base text-foreground/90 leading-relaxed">
                {selectedCharacterData?.revealedInfo}
              </p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Artwork Dialog */}
      <Dialog open={!!selectedArtwork} onOpenChange={() => setSelectedArtwork(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedArtworkData?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={selectedArtworkData?.path} 
              alt={selectedArtworkData?.title}
              className="w-full rounded-lg"
            />
            <p className="text-foreground/80">
              {selectedArtworkData?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
