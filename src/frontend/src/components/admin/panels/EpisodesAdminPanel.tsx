import { useState, useRef } from 'react';
import {
  useGetAllEpisodes,
  useCreateEpisode,
  useUpdateEpisode,
  useDeleteEpisode,
  useReorderEpisodes,
  useGetAllCharacters,
} from '../../../hooks/useQueries';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { Plus, Edit, Trash2, AlertCircle, GripVertical, Upload, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Progress } from '../../ui/progress';
import { validateAndConvertImage, EPISODE_MAX_FILE_SIZE } from '../../../utils/galleryImageUpload';
import { Episode, Visibility } from '../../../backend';

export function EpisodesAdminPanel() {
  const { data: episodes = [], isLoading, error } = useGetAllEpisodes();
  const { data: characters = [] } = useGetAllCharacters();
  const createMutation = useCreateEpisode();
  const updateMutation = useUpdateEpisode();
  const deleteMutation = useDeleteEpisode();
  const reorderMutation = useReorderEpisodes();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    releaseDate: '',
    releaseTime: '12:00',
    runtime: '',
    visibility: 'draft' as 'draft' | 'scheduled' | 'publicVisibility',
    taggedCharacterIds: [] as bigint[],
    writingComplete: false,
    storyboardComplete: false,
    voiceActingComplete: false,
    animationComplete: false,
    editingComplete: false,
  });
  const [formError, setFormError] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sort episodes by order field
  const sortedEpisodes = [...episodes].sort((a, b) => Number(a.order) - Number(b.order));

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      releaseDate: '',
      releaseTime: '12:00',
      runtime: '',
      visibility: 'draft',
      taggedCharacterIds: [],
      writingComplete: false,
      storyboardComplete: false,
      voiceActingComplete: false,
      animationComplete: false,
      editingComplete: false,
    });
    setFormError('');
    setThumbnailPreview('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const result = await validateAndConvertImage(file, EPISODE_MAX_FILE_SIZE);

    if (!result.success) {
      setUploadError(result.error || 'Failed to upload image');
      setThumbnailPreview('');
      setFormData((prev) => ({ ...prev, thumbnailUrl: '' }));
      return;
    }

    setThumbnailPreview(result.dataUrl || '');
    setFormData((prev) => ({ ...prev, thumbnailUrl: result.dataUrl || '' }));
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview('');
    setFormData((prev) => ({ ...prev, thumbnailUrl: '' }));
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCharacterToggle = (characterId: bigint) => {
    setFormData((prev) => {
      const isSelected = prev.taggedCharacterIds.some((id) => id === characterId);
      return {
        ...prev,
        taggedCharacterIds: isSelected
          ? prev.taggedCharacterIds.filter((id) => id !== characterId)
          : [...prev.taggedCharacterIds, characterId],
      };
    });
  };

  const visibilityToEnum = (vis: string): Visibility => {
    if (vis === 'scheduled') return Visibility.scheduled;
    if (vis === 'publicVisibility') return Visibility.publicVisibility;
    return Visibility.draft;
  };

  const visibilityFromEnum = (vis: Visibility): 'draft' | 'scheduled' | 'publicVisibility' => {
    if (vis === Visibility.scheduled) return 'scheduled';
    if (vis === Visibility.publicVisibility) return 'publicVisibility';
    return 'draft';
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required');
      return;
    }

    if (!formData.releaseDate) {
      setFormError('Release date is required');
      return;
    }

    try {
      // Combine date and time into a timestamp (nanoseconds)
      const dateTime = new Date(`${formData.releaseDate}T${formData.releaseTime}`);
      const explicitReleaseDate = BigInt(dateTime.getTime() * 1000000);

      const runtime = formData.runtime ? BigInt(formData.runtime) : null;

      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        explicitReleaseDate,
        runtime,
        visibility: visibilityToEnum(formData.visibility),
        taggedCharacterIds: formData.taggedCharacterIds,
        writingComplete: formData.writingComplete,
        storyboardComplete: formData.storyboardComplete,
        voiceActingComplete: formData.voiceActingComplete,
        animationComplete: formData.animationComplete,
        editingComplete: formData.editingComplete,
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

    if (!formData.releaseDate) {
      setFormError('Release date is required');
      return;
    }

    try {
      const dateTime = new Date(`${formData.releaseDate}T${formData.releaseTime}`);
      const explicitReleaseDate = BigInt(dateTime.getTime() * 1000000);

      const runtime = formData.runtime ? BigInt(formData.runtime) : null;

      await updateMutation.mutateAsync({
        id: editingEpisode.id,
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        explicitReleaseDate,
        runtime,
        visibility: visibilityToEnum(formData.visibility),
        taggedCharacterIds: formData.taggedCharacterIds,
        writingComplete: formData.writingComplete,
        storyboardComplete: formData.storyboardComplete,
        voiceActingComplete: formData.voiceActingComplete,
        animationComplete: formData.animationComplete,
        editingComplete: formData.editingComplete,
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
    // Convert timestamp to date and time
    const date = new Date(Number(episode.explicitReleaseDate) / 1000000);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().slice(0, 5);

    setFormData({
      title: episode.title,
      description: episode.description,
      videoUrl: episode.videoUrl,
      thumbnailUrl: episode.thumbnailUrl,
      releaseDate: dateStr,
      releaseTime: timeStr,
      runtime: episode.runtime ? String(episode.runtime) : '',
      visibility: visibilityFromEnum(episode.visibility),
      taggedCharacterIds: [...episode.taggedCharacterIds],
      writingComplete: episode.writingComplete,
      storyboardComplete: episode.storyboardComplete,
      voiceActingComplete: episode.voiceActingComplete,
      animationComplete: episode.animationComplete,
      editingComplete: episode.editingComplete,
    });
    setThumbnailPreview(episode.thumbnailUrl);
    setEditingEpisode(episode);
  };

  const handleProgressToggle = async (episode: Episode, field: keyof Episode) => {
    try {
      const date = new Date(Number(episode.explicitReleaseDate) / 1000000);
      const explicitReleaseDate = BigInt(date.getTime() * 1000000);

      await updateMutation.mutateAsync({
        id: episode.id,
        title: episode.title,
        description: episode.description,
        videoUrl: episode.videoUrl,
        thumbnailUrl: episode.thumbnailUrl,
        explicitReleaseDate,
        runtime: episode.runtime || null,
        visibility: episode.visibility,
        taggedCharacterIds: episode.taggedCharacterIds,
        writingComplete: field === 'writingComplete' ? !episode.writingComplete : episode.writingComplete,
        storyboardComplete: field === 'storyboardComplete' ? !episode.storyboardComplete : episode.storyboardComplete,
        voiceActingComplete:
          field === 'voiceActingComplete' ? !episode.voiceActingComplete : episode.voiceActingComplete,
        animationComplete: field === 'animationComplete' ? !episode.animationComplete : episode.animationComplete,
        editingComplete: field === 'editingComplete' ? !episode.editingComplete : episode.editingComplete,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to update progress');
    }
  };

  const calculateProgress = (episode: Episode): number => {
    const fields = [
      episode.writingComplete,
      episode.storyboardComplete,
      episode.voiceActingComplete,
      episode.animationComplete,
      episode.editingComplete,
      episode.released,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    try {
      const reorderedEpisodes = [...sortedEpisodes];
      const [draggedEpisode] = reorderedEpisodes.splice(draggedIndex, 1);
      reorderedEpisodes.splice(dropIndex, 0, draggedEpisode);

      // Create new order array with episode IDs
      const newOrder = reorderedEpisodes.map((ep) => ep.id);

      await reorderMutation.mutateAsync(newOrder);
    } catch (err: any) {
      alert(err.message || 'Failed to reorder episodes');
    } finally {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getVisibilityLabel = (vis: Visibility): string => {
    if (vis === Visibility.draft) return 'Draft';
    if (vis === Visibility.scheduled) return 'Scheduled';
    return 'Public';
  };

  const getVisibilityColor = (vis: Visibility): string => {
    if (vis === Visibility.draft) return 'text-gray-500';
    if (vis === Visibility.scheduled) return 'text-yellow-500';
    return 'text-green-500';
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
        <AlertDescription>Failed to load episodes. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Episodes</h2>
          <p className="text-muted-foreground">Manage your anime episodes</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Episode
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Episode</DialogTitle>
              <DialogDescription>Add a new episode to your series</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Episode title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Summary *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Episode summary"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image (Max 20MB)</Label>
                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    id="thumbnail"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileSelect}
                  />
                  {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
                  {thumbnailPreview && (
                    <div className="relative inline-block">
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="h-32 w-auto rounded border" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={handleRemoveThumbnail}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL (alternative)</Label>
                <Input
                  id="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Release Date *</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="releaseTime">Release Time</Label>
                  <Input
                    id="releaseTime"
                    type="time"
                    value={formData.releaseTime}
                    onChange={(e) => setFormData({ ...formData, releaseTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="runtime">Runtime (minutes)</Label>
                  <Input
                    id="runtime"
                    type="number"
                    min="0"
                    value={formData.runtime}
                    onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                    placeholder="24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value: 'draft' | 'scheduled' | 'publicVisibility') =>
                      setFormData({ ...formData, visibility: value })
                    }
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="publicVisibility">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div className="space-y-2">
                <Label>Tagged Characters</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                  {characters.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No characters available</p>
                  ) : (
                    characters.map((character) => (
                      <div key={String(character.id)} className="flex items-center space-x-2">
                        <Checkbox
                          id={`char-${character.id}`}
                          checked={formData.taggedCharacterIds.some((id) => id === character.id)}
                          onCheckedChange={() => handleCharacterToggle(character.id)}
                        />
                        <Label htmlFor={`char-${character.id}`} className="cursor-pointer font-normal">
                          {character.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Production Progress</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="writingComplete"
                      checked={formData.writingComplete}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, writingComplete: checked as boolean })
                      }
                    />
                    <Label htmlFor="writingComplete" className="cursor-pointer font-normal">
                      Writing
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="storyboardComplete"
                      checked={formData.storyboardComplete}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, storyboardComplete: checked as boolean })
                      }
                    />
                    <Label htmlFor="storyboardComplete" className="cursor-pointer font-normal">
                      Storyboard
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="voiceActingComplete"
                      checked={formData.voiceActingComplete}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, voiceActingComplete: checked as boolean })
                      }
                    />
                    <Label htmlFor="voiceActingComplete" className="cursor-pointer font-normal">
                      Voice Acting
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="animationComplete"
                      checked={formData.animationComplete}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, animationComplete: checked as boolean })
                      }
                    />
                    <Label htmlFor="animationComplete" className="cursor-pointer font-normal">
                      Animation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editingComplete"
                      checked={formData.editingComplete}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, editingComplete: checked as boolean })
                      }
                    />
                    <Label htmlFor="editingComplete" className="cursor-pointer font-normal">
                      Editing
                    </Label>
                  </div>
                </div>
              </div>

              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Episode'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sortedEpisodes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No episodes yet. Create your first episode to get started.
            </CardContent>
          </Card>
        ) : (
          sortedEpisodes.map((episode, index) => (
            <Card
              key={String(episode.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`transition-all ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${
                dragOverIndex === index ? 'border-primary border-2' : ''
              } cursor-move`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg">{episode.title}</CardTitle>
                        <span className={`text-sm font-medium ${getVisibilityColor(episode.visibility)}`}>
                          {getVisibilityLabel(episode.visibility)}
                        </span>
                      </div>
                      <CardDescription className="mt-1">{episode.description}</CardDescription>
                      {episode.runtime && (
                        <p className="text-sm text-muted-foreground mt-1">Runtime: {String(episode.runtime)} minutes</p>
                      )}
                      {episode.taggedCharacterIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {episode.taggedCharacterIds.map((charId) => {
                            const character = characters.find((c) => c.id === charId);
                            return character ? (
                              <span
                                key={String(charId)}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                              >
                                {character.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(episode)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(episode.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Production Progress</span>
                    <span className="text-sm text-muted-foreground">{calculateProgress(episode)}%</span>
                  </div>
                  <Progress value={calculateProgress(episode)} className="h-2" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`writing-${episode.id}`}
                        checked={episode.writingComplete}
                        onCheckedChange={() => handleProgressToggle(episode, 'writingComplete')}
                      />
                      <Label htmlFor={`writing-${episode.id}`} className="cursor-pointer text-sm font-normal">
                        Writing
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`storyboard-${episode.id}`}
                        checked={episode.storyboardComplete}
                        onCheckedChange={() => handleProgressToggle(episode, 'storyboardComplete')}
                      />
                      <Label htmlFor={`storyboard-${episode.id}`} className="cursor-pointer text-sm font-normal">
                        Storyboard
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`voice-${episode.id}`}
                        checked={episode.voiceActingComplete}
                        onCheckedChange={() => handleProgressToggle(episode, 'voiceActingComplete')}
                      />
                      <Label htmlFor={`voice-${episode.id}`} className="cursor-pointer text-sm font-normal">
                        Voice Acting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`animation-${episode.id}`}
                        checked={episode.animationComplete}
                        onCheckedChange={() => handleProgressToggle(episode, 'animationComplete')}
                      />
                      <Label htmlFor={`animation-${episode.id}`} className="cursor-pointer text-sm font-normal">
                        Animation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`editing-${episode.id}`}
                        checked={episode.editingComplete}
                        onCheckedChange={() => handleProgressToggle(episode, 'editingComplete')}
                      />
                      <Label htmlFor={`editing-${episode.id}`} className="cursor-pointer text-sm font-normal">
                        Editing
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`release-${episode.id}`} checked={episode.released} disabled />
                      <Label htmlFor={`release-${episode.id}`} className="text-sm font-normal text-muted-foreground">
                        Release
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingEpisode} onOpenChange={(open) => !open && setEditingEpisode(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Episode</DialogTitle>
            <DialogDescription>Update episode details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Episode title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Summary *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Episode summary"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Thumbnail Image (Max 20MB)</Label>
              <div className="space-y-2">
                <Input
                  ref={fileInputRef}
                  id="edit-thumbnail"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileSelect}
                />
                {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
                {thumbnailPreview && (
                  <div className="relative inline-block">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="h-32 w-auto rounded border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveThumbnail}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-thumbnailUrl">Thumbnail URL (alternative)</Label>
              <Input
                id="edit-thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-releaseDate">Release Date *</Label>
                <Input
                  id="edit-releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-releaseTime">Release Time</Label>
                <Input
                  id="edit-releaseTime"
                  type="time"
                  value={formData.releaseTime}
                  onChange={(e) => setFormData({ ...formData, releaseTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-runtime">Runtime (minutes)</Label>
                <Input
                  id="edit-runtime"
                  type="number"
                  min="0"
                  value={formData.runtime}
                  onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                  placeholder="24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-visibility">Visibility</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: 'draft' | 'scheduled' | 'publicVisibility') =>
                    setFormData({ ...formData, visibility: value })
                  }
                >
                  <SelectTrigger id="edit-visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="publicVisibility">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-videoUrl">Video URL</Label>
              <Input
                id="edit-videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div className="space-y-2">
              <Label>Tagged Characters</Label>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                {characters.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No characters available</p>
                ) : (
                  characters.map((character) => (
                    <div key={String(character.id)} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-char-${character.id}`}
                        checked={formData.taggedCharacterIds.some((id) => id === character.id)}
                        onCheckedChange={() => handleCharacterToggle(character.id)}
                      />
                      <Label htmlFor={`edit-char-${character.id}`} className="cursor-pointer font-normal">
                        {character.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Production Progress</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-writingComplete"
                    checked={formData.writingComplete}
                    onCheckedChange={(checked) => setFormData({ ...formData, writingComplete: checked as boolean })}
                  />
                  <Label htmlFor="edit-writingComplete" className="cursor-pointer font-normal">
                    Writing
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-storyboardComplete"
                    checked={formData.storyboardComplete}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, storyboardComplete: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-storyboardComplete" className="cursor-pointer font-normal">
                    Storyboard
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-voiceActingComplete"
                    checked={formData.voiceActingComplete}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, voiceActingComplete: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-voiceActingComplete" className="cursor-pointer font-normal">
                    Voice Acting
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-animationComplete"
                    checked={formData.animationComplete}
                    onCheckedChange={(checked) => setFormData({ ...formData, animationComplete: checked as boolean })}
                  />
                  <Label htmlFor="edit-animationComplete" className="cursor-pointer font-normal">
                    Animation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-editingComplete"
                    checked={formData.editingComplete}
                    onCheckedChange={(checked) => setFormData({ ...formData, editingComplete: checked as boolean })}
                  />
                  <Label htmlFor="edit-editingComplete" className="cursor-pointer font-normal">
                    Editing
                  </Label>
                </div>
              </div>
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEpisode(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update Episode'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
