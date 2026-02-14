import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Upload, X, Loader2 } from 'lucide-react';
import { validateAndConvertImage } from '../../utils/galleryImageUpload';
import { useCreateGalleryItem, useGetAllCharacters, useGetAllClans } from '../../hooks/useQueries';
import { encodeGalleryMetadata } from '../../utils/adminContentAdapters';

interface GalleryUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GalleryUploadDialog({ open, onOpenChange }: GalleryUploadDialogProps) {
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artworkTitle, setArtworkTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creditLink, setCreditLink] = useState('');
  const [category, setCategory] = useState<'Concept Art' | 'Fight Scenes' | 'Character Designs'>('Concept Art');
  const [featured, setFeatured] = useState(false);
  const [taggedCharacterIds, setTaggedCharacterIds] = useState<string[]>([]);
  const [taggedClanIds, setTaggedClanIds] = useState<string[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createMutation = useCreateGalleryItem();
  const { data: characters = [] } = useGetAllCharacters();
  const { data: clans = [] } = useGetAllClans();

  const handleFileSelect = async (file: File) => {
    setError(null);
    const result = await validateAndConvertImage(file);
    
    if (result.success && result.dataUrl) {
      setImageDataUrl(result.dataUrl);
      // Auto-generate title from filename if empty
      if (!title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(fileName);
      }
    } else {
      setError(result.error || 'Failed to process image');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      setError('Please drop a valid image file (PNG, JPEG, or WebP)');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !artistName.trim() || !artworkTitle.trim() || !imageDataUrl) {
      setError('Title, artist name, artwork title, and image are required');
      return;
    }

    try {
      const encodedDescription = encodeGalleryMetadata(description, {
        category,
        alt: title,
      });

      await createMutation.mutateAsync({
        title,
        artistName,
        artworkTitle,
        description: description || null,
        creditLink: creditLink || null,
        imageUrl: imageDataUrl,
        creator: 'Admin',
        featured,
        taggedCharacterIds: taggedCharacterIds.map(id => BigInt(id)),
        taggedClanIds: taggedClanIds.map(id => BigInt(id)),
      });

      // Reset form
      setTitle('');
      setArtistName('');
      setArtworkTitle('');
      setDescription('');
      setCreditLink('');
      setCategory('Concept Art');
      setFeatured(false);
      setTaggedCharacterIds([]);
      setTaggedClanIds([]);
      setImageDataUrl(null);
      setError(null);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      setTitle('');
      setArtistName('');
      setArtworkTitle('');
      setDescription('');
      setCreditLink('');
      setCategory('Concept Art');
      setFeatured(false);
      setTaggedCharacterIds([]);
      setTaggedClanIds([]);
      setImageDataUrl(null);
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Gallery Image</DialogTitle>
          <DialogDescription>
            Add a new image to the gallery with fan art metadata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Image Upload Area */}
          {!imageDataUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop an image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                PNG, JPEG, or WebP (max 5MB)
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={imageDataUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setImageDataUrl(null)}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Gallery item title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artistName">Artist Name / Username</Label>
              <Input
                id="artistName"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Artist name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artworkTitle">Artwork Title</Label>
              <Input
                id="artworkTitle"
                value={artworkTitle}
                onChange={(e) => setArtworkTitle(e.target.value)}
                placeholder="Artwork title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional description"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLink">Credit / Social Media Link (optional)</Label>
            <Input
              id="creditLink"
              value={creditLink}
              onChange={(e) => setCreditLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
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

          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Featured</Label>
              <p className="text-sm text-muted-foreground">Display this artwork in the Featured Fan Art section</p>
            </div>
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
          </div>

          <div className="space-y-2">
            <Label>Tagged Characters (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {characters.map((char) => (
                <Button
                  key={char.id.toString()}
                  type="button"
                  variant={taggedCharacterIds.includes(char.id.toString()) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const id = char.id.toString();
                    setTaggedCharacterIds(
                      taggedCharacterIds.includes(id)
                        ? taggedCharacterIds.filter(cid => cid !== id)
                        : [...taggedCharacterIds, id]
                    );
                  }}
                >
                  {char.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tagged Clans (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {clans.map((clan) => (
                <Button
                  key={clan.id.toString()}
                  type="button"
                  variant={taggedClanIds.includes(clan.id.toString()) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const id = clan.id.toString();
                    setTaggedClanIds(
                      taggedClanIds.includes(id)
                        ? taggedClanIds.filter(cid => cid !== id)
                        : [...taggedClanIds, id]
                    );
                  }}
                >
                  {clan.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || !imageDataUrl}>
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
