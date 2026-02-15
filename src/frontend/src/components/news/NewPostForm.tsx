import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { GlowingGlassPanel } from '../common/GlowingGlassPanel';

interface NewPostFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function NewPostForm({ onSubmit, isSubmitting, error }: NewPostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    if (!content.trim()) {
      setValidationError('Content is required');
      return;
    }

    try {
      await onSubmit(title.trim(), content.trim());
      setTitle('');
      setContent('');
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <GlowingGlassPanel className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-bold text-foreground mb-4">Create New Post</h3>

        {(validationError || error) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError || error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            disabled={isSubmitting}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your update or announcement..."
            rows={6}
            disabled={isSubmitting}
            className="bg-background resize-none"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish Post'
          )}
        </Button>
      </form>
    </GlowingGlassPanel>
  );
}
