import { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useProPresentationStore } from './proPresentationStore';
import { useUpdateProPresentation } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { encodeProPresentation } from './proPresentationCodec';

export function ProToolbar() {
  const { addBlock, blocks } = useProPresentationStore();
  const updateMutation = useUpdateProPresentation();
  const [isSaving, setIsSaving] = useState(false);

  const handleAddTextBlock = () => {
    addBlock();
    toast.success('Text block added');
  };

  const handleDone = async () => {
    try {
      setIsSaving(true);
      const content = encodeProPresentation(blocks);
      await updateMutation.mutateAsync(content);
      toast.success('Changes saved successfully');
      window.location.hash = '#admin';
    } catch (error) {
      console.error('Failed to save Pro presentation:', error);
      toast.error('Failed to save changes');
      // If unauthorized, exit Pro mode safely
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        toast.error('Unauthorized: Admin access required');
        window.location.hash = '';
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="border-border bg-card/95 backdrop-blur-xl shadow-glow-lg p-3">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddTextBlock}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Text Block
          </Button>
          <Button
            onClick={handleDone}
            disabled={isSaving}
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Done
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
