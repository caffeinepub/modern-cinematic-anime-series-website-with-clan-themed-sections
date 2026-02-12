import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Upload, X, Loader2 } from 'lucide-react';
import { validateAndConvertImage } from '../../utils/galleryImageUpload';
import { useCreateGalleryItem } from '../../hooks/useQueries';
import { encodeGalleryMetadata } from '../../utils/adminContentAdapters';

interface GalleryUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GalleryUploadDialog({ open, onOpenChange }: GalleryUploadDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Concept Art' | 'Fight Scenes' | 'Character Designs'>('Concept Art');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createMutation = useCreateGalleryItem();

  const handleFileSelect = async (file: File) => {
    setError(null);
    const result = await validateAndConvertImage(file);
    
    if (result.success && result.dataUrl) {
      setImageDataUrl(result.dataUrl);
      // Auto-generate title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
    } else {
      setError(result.error || 'Failed to process image');
      setImageDataUrl(null);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImageDataUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!imageDataUrl) {
      setError('Please select an image to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for the image');
      return;
    }

    try {
      const description = encodeGalleryMetadata('', {
        category,
        alt: title,
      });

      await createMutation.mutateAsync({
        title: title.trim(),
        imageUrl: imageDataUrl,
        description,
        creator: 'Admin',
      });

      // Reset form and close dialog
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please try again.');
    }
  };

  const handleClose = () => {
    setTitle('');
    setCategory('Concept Art');
    setImageDataUrl(null);
    setError(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Gallery Image</DialogTitle>
          <DialogDescription>
            Add a new image to the gallery. Supported formats: PNG, JPEG, WebP (max 5MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {imageDataUrl ? (
              <div className="relative">
                <img
                  src={imageDataUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Upload className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drag and drop an image here, or
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={handleBrowseClick}
                  >
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPEG, or WebP (max 5MB)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
              disabled={createMutation.isPending}
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as typeof category)}
              disabled={createMutation.isPending}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Concept Art">Concept Art</SelectItem>
                <SelectItem value="Fight Scenes">Fight Scenes</SelectItem>
                <SelectItem value="Character Designs">Character Designs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!imageDataUrl || !title.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
