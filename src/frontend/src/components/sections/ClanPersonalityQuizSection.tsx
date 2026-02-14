import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Copy, RotateCcw, Sparkles } from 'lucide-react';
import { quizQuestions } from '../../data/clanQuizQuestions';
import { clanResults } from '../../data/clanQuizResults';
import { initializeScores, calculateResult, ClanScores } from '../quiz/quizScoring';
import { ResultsCard } from '../quiz/ResultsCard';
import { copyResultToClipboard } from '../quiz/shareUtils';
import { toast } from 'sonner';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function ClanPersonalityQuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<ClanScores>(initializeScores());
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const { ref: sectionRef, isVisible } = useRevealOnScroll({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (answerScores: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(answerScores).forEach(([clan, points]) => {
      if (clan in newScores) {
        newScores[clan as keyof ClanScores] += points;
      }
    });
    setScores(newScores);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete, calculate result
      const resultId = calculateResult(newScores);
      setResult(resultId);
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores(initializeScores());
    setShowResults(false);
    setResult(null);
  };

  const handleCopyResult = async () => {
    if (!result) return;
    
    const clanResult = clanResults.find(c => c.id === result);
    if (!clanResult) return;
    
    const success = await copyResultToClipboard(clanResult.name, clanResult.personality);
    if (success) {
      toast.success('Result copied to clipboard!');
    } else {
      toast.error('Failed to copy. Please try again.');
    }
  };

  const currentQuestionData = quizQuestions[currentQuestion];
  const resultData = result ? clanResults.find(c => c.id === result) : null;

  return (
    <section
      id="quiz"
      ref={sectionRef}
      className={`relative py-24 overflow-hidden transition-all duration-600 ${
        !prefersReducedMotion && isVisible ? 'animate-fade-in-up' : isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-conic from-accent/5 via-transparent to-primary/5 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Discover Your Clan</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-glow">
            Clan Personality Quiz
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer these questions to discover which clan you truly belong to
          </p>
        </div>

        {/* Quiz Content */}
        <div className="max-w-3xl mx-auto">
          {!showResults ? (
            <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm shadow-glow-lg">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mt-6">
                  {currentQuestionData.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestionData.answers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(answer.scores)}
                    variant="outline"
                    className="w-full h-auto py-4 px-6 text-left justify-start hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="text-base">{answer.text}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ) : resultData ? (
            <div className="space-y-6">
              <ResultsCard result={resultData} />
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleCopyResult}
                  variant="default"
                  size="lg"
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Result
                </Button>
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </Button>
              </div>
              
              {/* Screenshot Instructions */}
              <Card className="bg-muted/50 border-muted">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Take a screenshot of your result card to share with friends!
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
