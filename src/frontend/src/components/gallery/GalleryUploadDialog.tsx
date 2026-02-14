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
import { validateAndConvertImage, GALLERY_MAX_FILE_SIZE } from '../../utils/galleryImageUpload';
import { useCreateGalleryItem, useSubmitFanArt, useGetAllCharacters, useGetAllClans, useIsCallerAdmin } from '../../hooks/useQueries';
import { encodeGalleryMetadata } from '../../utils/adminContentAdapters';

interface GalleryUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GalleryUploadDialog({ open, onOpenChange }: GalleryUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artworkTitle, setArtworkTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creditLink, setCreditLink] = useState('');
  const [category, setCategory] = useState<string>('Concept Art');
  const [featured, setFeatured] = useState(false);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [selectedClanIds, setSelectedClanIds] = useState<string[]>([]);

  const createMutation = useCreateGalleryItem();
  const submitFanArtMutation = useSubmitFanArt();
  const { data: characters = [] } = useGetAllCharacters();
  const { data: clans = [] } = useGetAllClans();
  const { data: isAdmin } = useIsCallerAdmin();

  const isUploading = createMutation.isPending || submitFanArtMutation.isPending;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    try {
      const result = await validateAndConvertImage(file, GALLERY_MAX_FILE_SIZE);
      if (result.success && result.dataUrl) {
        setImageFile(file);
        setImagePreview(result.dataUrl);
        setError(null);
      } else {
        setError(result.error || 'Failed to process image');
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview || !imageFile) {
      setError('Please select an image');
      return;
    }

    if (!artistName.trim()) {
      setError('Artist name is required');
      return;
    }

    if (!artworkTitle.trim()) {
      setError('Artwork title is required');
      return;
    }

    try {
      const encodedDescription = encodeGalleryMetadata(
        description,
        {
          category: category as 'Concept Art' | 'Fight Scenes' | 'Character Designs',
          alt: artworkTitle
        }
      );

      const params = {
        title: title.trim() || artworkTitle.trim(),
        artistName: artistName.trim(),
        artworkTitle: artworkTitle.trim(),
        description: encodedDescription,
        creditLink: creditLink.trim() || null,
        imageUrl: imagePreview,
        creator: artistName.trim(),
        taggedCharacterIds: selectedCharacterIds.map((id) => BigInt(id)),
        taggedClanIds: selectedClanIds.map((id) => BigInt(id)),
      };

      if (isAdmin) {
        await createMutation.mutateAsync({
          ...params,
          featured,
        });
      } else {
        await submitFanArtMutation.mutateAsync(params);
      }

      // Reset form
      setTitle('');
      setArtistName('');
      setArtworkTitle('');
      setDescription('');
      setCreditLink('');
      setCategory('Concept Art');
      setFeatured(false);
      setSelectedCharacterIds([]);
      setSelectedClanIds([]);
      handleRemoveImage();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    }
  };

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacterIds((prev) =>
      prev.includes(characterId) ? prev.filter((id) => id !== characterId) : [...prev, characterId]
    );
  };

  const handleClanToggle = (clanId: string) => {
    setSelectedClanIds((prev) =>
      prev.includes(clanId) ? prev.filter((id) => id !== clanId) : [...prev, clanId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Fan Art</DialogTitle>
          <DialogDescription>
            Share your artwork with the Whispers Of The White Moon community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Upload Area */}
          <div>
            <Label>Image</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
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
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop an image here, or click to select
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Artist Name */}
          <div>
            <Label htmlFor="artistName">Artist Name *</Label>
            <Input
              id="artistName"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Your name or artist handle"
              className="mt-2"
            />
          </div>

          {/* Artwork Title */}
          <div>
            <Label htmlFor="artworkTitle">Artwork Title *</Label>
            <Input
              id="artworkTitle"
              value={artworkTitle}
              onChange={(e) => setArtworkTitle(e.target.value)}
              placeholder="Title of your artwork"
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your artwork..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Credit Link */}
          <div>
            <Label htmlFor="creditLink">Credit Link (Optional)</Label>
            <Input
              id="creditLink"
              value={creditLink}
              onChange={(e) => setCreditLink(e.target.value)}
              placeholder="https://your-portfolio.com or social media link"
              className="mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Concept Art">Concept Art</SelectItem>
                <SelectItem value="Fight Scenes">Fight Scenes</SelectItem>
                <SelectItem value="Character Designs">Character Designs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Character Tags */}
          {characters.length > 0 && (
            <div>
              <Label>Tag Characters (Optional)</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {characters.map((char) => (
                  <Button
                    key={char.id.toString()}
                    type="button"
                    variant={selectedCharacterIds.includes(char.id.toString()) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCharacterToggle(char.id.toString())}
                  >
                    {char.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Clan Tags */}
          {clans.length > 0 && (
            <div>
              <Label>Tag Clans (Optional)</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {clans.map((clan) => (
                  <Button
                    key={clan.id.toString()}
                    type="button"
                    variant={selectedClanIds.includes(clan.id.toString()) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleClanToggle(clan.id.toString())}
                  >
                    {clan.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Admin-only: Featured Toggle */}
          {isAdmin && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="featured">Featured Artwork</Label>
                <p className="text-sm text-muted-foreground">
                  Display this artwork in the featured section
                </p>
              </div>
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
