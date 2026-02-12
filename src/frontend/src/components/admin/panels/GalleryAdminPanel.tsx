import { useState, useRef } from 'react';
import { useGetAllGalleryItems, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem } from '../../../hooks/useQueries';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { Plus, Edit, Trash2, AlertCircle, Upload, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { encodeGalleryMetadata, decodeGalleryMetadata } from '../../../utils/adminContentAdapters';
import { validateAndConvertImage } from '../../../utils/galleryImageUpload';
import type { GalleryItem } from '../../../backend';

export function GalleryAdminPanel() {
  const { data: galleryItems = [], isLoading, error } = useGetAllGalleryItems();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: '',
    creator: '',
    category: 'Concept Art',
    alt: '',
  });
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      description: '',
      creator: '',
      category: 'Concept Art',
      alt: '',
    });
    setFormError('');
    setImagePreview('');
    setIsProcessingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setFormError('');

    const result = await validateAndConvertImage(file);

    if (result.success && result.dataUrl) {
      setFormData({ ...formData, imageUrl: result.dataUrl });
      setImagePreview(result.dataUrl);
    } else {
      setFormError(result.error || 'Failed to process image');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    setIsProcessingFile(false);
  };

  const handleClearImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      setFormError('Title and image are required');
      return;
    }

    try {
      const encodedDescription = encodeGalleryMetadata(formData.description, {
        category: formData.category,
        alt: formData.alt,
      });

      await createMutation.mutateAsync({
        title: formData.title,
        imageUrl: formData.imageUrl,
        description: encodedDescription,
        creator: formData.creator || 'Unknown',
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create gallery item');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !formData.title.trim() || !formData.imageUrl.trim()) {
      setFormError('Title and image are required');
      return;
    }

    try {
      const encodedDescription = encodeGalleryMetadata(formData.description, {
        category: formData.category,
        alt: formData.alt,
      });

      await updateMutation.mutateAsync({
        id: editingItem.id,
        title: formData.title,
        imageUrl: formData.imageUrl,
        description: encodedDescription,
        creator: formData.creator || 'Unknown',
      });

      setEditingItem(null);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update gallery item');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete gallery item');
    }
  };

  const openEditDialog = (item: GalleryItem) => {
    const { description, metadata } = decodeGalleryMetadata(item.description);
    setFormData({
      title: item.title,
      imageUrl: item.imageUrl,
      description,
      creator: item.creator,
      category: metadata.category || 'Concept Art',
      alt: metadata.alt || '',
    });
    setImagePreview(item.imageUrl);
    setEditingItem(item);
  };

  const renderImageUploadSection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingFile}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isProcessingFile ? 'Processing...' : 'Upload Image'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Upload PNG, JPEG, or WebP (max 5MB)
        </p>
      </div>

      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClearImage}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Or enter Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => {
            setFormData({ ...formData, imageUrl: e.target.value });
            if (e.target.value && !e.target.value.startsWith('data:')) {
              setImagePreview(e.target.value);
            }
          }}
          placeholder="/assets/generated/..."
          disabled={isProcessingFile}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load gallery items: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gallery</h3>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Gallery Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Gallery Item</DialogTitle>
              <DialogDescription>Add a new image to the gallery</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <Input
                  id="create-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Image title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="create-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concept Art">Concept Art</SelectItem>
                    <SelectItem value="Fight Scenes">Fight Scenes</SelectItem>
                    <SelectItem value="Character Designs">Character Designs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderImageUploadSection()}
              <div className="space-y-2">
                <Label htmlFor="create-alt">Alt Text</Label>
                <Input
                  id="create-alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="Image description for accessibility"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-creator">Creator</Label>
                <Input
                  id="create-creator"
                  value={formData.creator}
                  onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                  placeholder="Artist name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-description">Description (optional)</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional description"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending || isProcessingFile}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {galleryItems.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No gallery items yet. Create your first item to get started.
            </CardContent>
          </Card>
        ) : (
          galleryItems.map((item) => {
            const { description, metadata } = decodeGalleryMetadata(item.description);
            return (
              <Card key={item.id.toString()}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{metadata.category || 'Uncategorized'}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <img src={item.imageUrl} alt={metadata.alt || item.title} className="w-full h-32 object-cover rounded" />
                  <p className="text-sm text-muted-foreground">Creator: {item.creator}</p>
                  {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => {
        if (!open) {
          setEditingItem(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
            <DialogDescription>Update gallery item information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concept Art">Concept Art</SelectItem>
                  <SelectItem value="Fight Scenes">Fight Scenes</SelectItem>
                  <SelectItem value="Character Designs">Character Designs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderImageUploadSection()}
            <div className="space-y-2">
              <Label htmlFor="edit-alt">Alt Text</Label>
              <Input
                id="edit-alt"
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-creator">Creator</Label>
              <Input
                id="edit-creator"
                value={formData.creator}
                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending || isProcessingFile}>
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
