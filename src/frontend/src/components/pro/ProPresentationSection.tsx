import { useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useGetProPresentation } from '../../hooks/useQueries';
import { useProPresentationStore } from './proPresentationStore';
import { decodeProPresentation } from './proPresentationCodec';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

interface ProPresentationSectionProps {
  isProMode: boolean;
}

export function ProPresentationSection({ isProMode }: ProPresentationSectionProps) {
  const { data: proPresentationData, isLoading } = useGetProPresentation();
  const { blocks, setBlocks, updateBlock, removeBlock, ensureAtLeastOneBlock } = useProPresentationStore();
  const { ref, isVisible } = useRevealOnScroll();

  // Load persisted data on mount
  useEffect(() => {
    if (proPresentationData !== undefined) {
      const decodedBlocks = decodeProPresentation(proPresentationData);
      setBlocks(decodedBlocks);
    }
  }, [proPresentationData, setBlocks]);

  // Ensure at least one block exists in Pro mode
  useEffect(() => {
    if (isProMode && !isLoading && blocks.length === 0) {
      ensureAtLeastOneBlock();
    }
  }, [isProMode, isLoading, blocks.length, ensureAtLeastOneBlock]);

  // Don't render if no blocks and not in Pro mode
  if (!isProMode && blocks.length === 0) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  return (
    <section
      id="pro-presentation"
      ref={ref}
      className={`relative py-24 px-4 overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="space-y-8">
          {blocks.map((block) => (
            <Card
              key={block.id}
              className="border-border bg-card/50 backdrop-blur-sm shadow-glow-sm hover:shadow-glow-md transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                {isProMode ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <Input
                          value={block.title}
                          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                          placeholder="Enter title..."
                          className="text-2xl font-bold border-primary/20 focus:border-primary bg-background/50"
                        />
                        <Textarea
                          value={block.body}
                          onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                          placeholder="Enter content..."
                          rows={6}
                          className="border-primary/20 focus:border-primary bg-background/50 resize-none"
                        />
                      </div>
                      <Button
                        onClick={() => removeBlock(block.id)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {block.title && (
                      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
                        {block.title}
                      </h3>
                    )}
                    {block.body && (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {block.body}
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
