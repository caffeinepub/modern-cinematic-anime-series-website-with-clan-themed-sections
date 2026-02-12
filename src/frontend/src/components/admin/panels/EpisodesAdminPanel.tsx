import { useState } from 'react';
import { useGetAllEpisodes, useCreateEpisode, useUpdateEpisode, useDeleteEpisode } from '../../../hooks/useQueries';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { encodeEpisodeMetadata, decodeEpisodeMetadata } from '../../../utils/adminContentAdapters';
import type { Episode } from '../../../backend';

export function EpisodesAdminPanel() {
  const { data: episodes = [], isLoading, error } = useGetAllEpisodes();
  const createMutation = useCreateEpisode();
  const updateMutation = useUpdateEpisode();
  const deleteMutation = useDeleteEpisode();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    number: 1,
    status: 'Coming Soon',
  });
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      number: 1,
      status: 'Coming Soon',
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required');
      return;
    }

    try {
      const encodedDescription = encodeEpisodeMetadata(formData.description, {
        number: formData.number,
        status: formData.status,
      });

      await createMutation.mutateAsync({
        title: formData.title,
        description: encodedDescription,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        releaseDate: BigInt(Date.now() * 1000000),
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create episode');
    }
  };

  const handleUpdate = async () => {
    if (!editingEpisode || !formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required');
      return;
    }

    try {
      const encodedDescription = encodeEpisodeMetadata(formData.description, {
        number: formData.number,
        status: formData.status,
      });

      await updateMutation.mutateAsync({
        id: editingEpisode.id,
        title: formData.title,
        description: encodedDescription,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        releaseDate: editingEpisode.releaseDate,
      });

      setEditingEpisode(null);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update episode');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this episode?')) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete episode');
    }
  };

  const openEditDialog = (episode: Episode) => {
    const { description, metadata } = decodeEpisodeMetadata(episode.description);
    setFormData({
      title: episode.title,
      description,
      videoUrl: episode.videoUrl,
      thumbnailUrl: episode.thumbnailUrl,
      number: metadata.number || 1,
      status: metadata.status || 'Coming Soon',
    });
    setEditingEpisode(episode);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load episodes: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Episodes</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Episode
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Episode</DialogTitle>
              <DialogDescription>Add a new episode to the series</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="create-number">Episode Number</Label>
                <Input
                  id="create-number"
                  type="number"
                  min="1"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <Input
                  id="create-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Episode title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-description">Summary</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Episode summary"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="create-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Released">Released</SelectItem>
                    <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-thumbnailUrl">Thumbnail Image URL (optional)</Label>
                <Input
                  id="create-thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-videoUrl">Video URL (optional)</Label>
                <Input
                  id="create-videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {episodes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No episodes yet. Create your first episode to get started.
            </CardContent>
          </Card>
        ) : (
          episodes.map((episode) => {
            const { description, metadata } = decodeEpisodeMetadata(episode.description);
            return (
              <Card key={episode.id.toString()}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        Episode {metadata.number || '?'}: {episode.title}
                      </CardTitle>
                      <CardDescription>
                        Status: {metadata.status || 'Unknown'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(episode)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(episode.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  {episode.thumbnailUrl && (
                    <p className="text-xs text-muted-foreground mt-2">Thumbnail: {episode.thumbnailUrl}</p>
                  )}
                  {episode.videoUrl && (
                    <p className="text-xs text-muted-foreground mt-1">Video: {episode.videoUrl}</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingEpisode} onOpenChange={(open) => !open && setEditingEpisode(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Episode</DialogTitle>
            <DialogDescription>Update episode information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-number">Episode Number</Label>
              <Input
                id="edit-number"
                type="number"
                min="1"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Summary</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Released">Released</SelectItem>
                  <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-thumbnailUrl">Thumbnail Image URL (optional)</Label>
              <Input
                id="edit-thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-videoUrl">Video URL (optional)</Label>
              <Input
                id="edit-videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEpisode(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
