import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Copy, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { affinityQuizQuestions } from '../../data/affinityQuizQuestions';
import { initializeCharacterScores, calculateCharacterMatch } from '../affinity/affinityScoring';
import { CharacterScores } from '../affinity/affinityTypes';
import { AffinityResultsCard } from '../affinity/AffinityResultsCard';
import { getCharacterById } from '../../data/affinityCharacters';
import { buildShareText, copyToClipboard, shareResult } from '../affinity/affinityShareUtils';
import { toast } from 'sonner';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function CharacterAffinityMatcherSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<CharacterScores>(initializeCharacterScores());
  const [showResults, setShowResults] = useState(false);
  const [matchedCharacterId, setMatchedCharacterId] = useState<string | null>(null);
  const [soulResonance, setSoulResonance] = useState<number>(0);
  
  const { ref: sectionRef, isVisible } = useRevealOnScroll({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const progress = ((currentQuestion + 1) / affinityQuizQuestions.length) * 100;

  const handleAnswer = (answerScores: Record<string, number>) => {
    const newScores = { ...scores };
    
    Object.entries(answerScores).forEach(([character, points]) => {
      if (character in newScores) {
        newScores[character as keyof CharacterScores] += points;
      }
    });
    
    setScores(newScores);
    
    if (currentQuestion < affinityQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final result
      const match = calculateCharacterMatch(newScores);
      setMatchedCharacterId(match.characterId);
      setSoulResonance(match.soulResonance);
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setScores(initializeCharacterScores());
    setShowResults(false);
    setMatchedCharacterId(null);
    setSoulResonance(0);
  };

  const handleCopyResult = async () => {
    if (!matchedCharacterId) return;
    
    const character = getCharacterById(matchedCharacterId as any);
    if (!character) return;
    
    const shareText = buildShareText(character.name, character.whyYouMatch, soulResonance);
    const success = await copyToClipboard(shareText);
    
    if (success) {
      toast.success('Result copied to clipboard!');
    } else {
      toast.error('Failed to copy result');
    }
  };

  const handleShare = async () => {
    if (!matchedCharacterId) return;
    
    const character = getCharacterById(matchedCharacterId as any);
    if (!character) return;
    
    const success = await shareResult(character.name, character.whyYouMatch, soulResonance);
    
    if (success) {
      toast.success('Result shared successfully!');
    } else {
      // If share was cancelled, don't show error
      // If it failed and fell back to clipboard, show success
      const fallbackSuccess = await copyToClipboard(buildShareText(character.name, character.whyYouMatch, soulResonance));
      if (fallbackSuccess) {
        toast.success('Result copied to clipboard!');
      }
    }
  };

  const currentQuestionData = affinityQuizQuestions[currentQuestion];
  const matchedCharacter = matchedCharacterId ? getCharacterById(matchedCharacterId as any) : null;

  return (
    <section 
      id="affinity"
      ref={sectionRef}
      className={`relative py-24 px-4 overflow-hidden transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(var(--accent)/0.1),transparent_50%)]" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className={`w-8 h-8 text-primary ${!prefersReducedMotion ? 'animate-pulse-glow' : ''}`} />
            <h2 className="text-5xl md:text-6xl font-black text-primary text-glow">
              Character Affinity Matcher
            </h2>
            <Sparkles className={`w-8 h-8 text-primary ${!prefersReducedMotion ? 'animate-pulse-glow' : ''}`} />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover which main character resonates with your soul. Answer honestly to reveal your true affinity.
          </p>
        </div>

        {!showResults ? (
          <Card className={`border-2 border-primary/50 bg-card/95 backdrop-blur-sm shadow-glow transition-all duration-300 ${
            !prefersReducedMotion ? 'hover:shadow-glow-lg' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-base px-4 py-1">
                  Question {currentQuestion + 1} of {affinityQuizQuestions.length}
                </Badge>
                <span className="text-sm text-muted-foreground font-semibold">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2 mb-6" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {currentQuestionData.answers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(answer.scores)}
                  variant="outline"
                  className={`w-full text-left h-auto py-4 px-6 text-base font-medium transition-all duration-300 hover:border-primary hover:bg-primary/10 ${
                    !prefersReducedMotion ? 'hover:shadow-glow' : ''
                  }`}
                >
                  {answer.text}
                </Button>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Results reveal */}
            <div className={`text-center space-y-4 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
              <h3 className="text-3xl font-black text-primary text-glow">
                Your Destiny Has Been Revealed
              </h3>
              <p className="text-lg text-muted-foreground">
                The threads of fate have spoken...
              </p>
            </div>

            {matchedCharacter && (
              <AffinityResultsCard 
                character={matchedCharacter}
                soulResonance={soulResonance}
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleCopyResult}
                variant="outline"
                size="lg"
                className="gap-2 hover:border-primary hover:bg-primary/10"
              >
                <Copy className="w-5 h-5" />
                Copy Result
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="gap-2 hover:border-accent hover:bg-accent/10"
              >
                <Share2 className="w-5 h-5" />
                Share Your Match
              </Button>
              
              <Button
                onClick={handleRetake}
                variant="default"
                size="lg"
                className="gap-2 shadow-glow"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
