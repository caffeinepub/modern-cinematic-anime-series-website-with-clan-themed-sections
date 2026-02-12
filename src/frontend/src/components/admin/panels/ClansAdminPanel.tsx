import { useState } from 'react';
import { useGetAllClans, useCreateClan, useUpdateClan, useDeleteClan } from '../../../hooks/useQueries';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { encodeClanMetadata, decodeClanMetadata } from '../../../utils/adminContentAdapters';
import type { Clan } from '../../../backend';

export function ClansAdminPanel() {
  const { data: clans = [], isLoading, error } = useGetAllClans();
  const createMutation = useCreateClan();
  const updateMutation = useUpdateClan();
  const deleteMutation = useDeleteClan();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClan, setEditingClan] = useState<Clan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accentColor: '',
    glowClass: '',
    sigilPath: '',
  });
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      accentColor: '',
      glowClass: '',
      sigilPath: '',
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError('Name and description are required');
      return;
    }

    try {
      const encodedDescription = encodeClanMetadata(formData.description, {
        accentColor: formData.accentColor,
        glowClass: formData.glowClass,
        sigilPath: formData.sigilPath,
      });

      await createMutation.mutateAsync({
        name: formData.name,
        description: encodedDescription,
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create clan');
    }
  };

  const handleUpdate = async () => {
    if (!editingClan || !formData.name.trim() || !formData.description.trim()) {
      setFormError('Name and description are required');
      return;
    }

    try {
      const encodedDescription = encodeClanMetadata(formData.description, {
        accentColor: formData.accentColor,
        glowClass: formData.glowClass,
        sigilPath: formData.sigilPath,
      });

      await updateMutation.mutateAsync({
        id: editingClan.id,
        name: formData.name,
        description: encodedDescription,
      });

      setEditingClan(null);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update clan');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this clan?')) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete clan');
    }
  };

  const openEditDialog = (clan: Clan) => {
    const { description, metadata } = decodeClanMetadata(clan.description);
    setFormData({
      name: clan.name,
      description,
      accentColor: metadata.accentColor || '',
      glowClass: metadata.glowClass || '',
      sigilPath: metadata.sigilPath || '',
    });
    setEditingClan(clan);
  };

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
        <AlertDescription>Failed to load clans: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Clans</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Clan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Clan</DialogTitle>
              <DialogDescription>Add a new clan to the series</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Clan name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clan description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-accentColor">Accent Color (optional)</Label>
                <Input
                  id="create-accentColor"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  placeholder="e.g., oklch(var(--clan-moon))"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-glowClass">Glow Class (optional)</Label>
                <Input
                  id="create-glowClass"
                  value={formData.glowClass}
                  onChange={(e) => setFormData({ ...formData, glowClass: e.target.value })}
                  placeholder="e.g., glow-moon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-sigilPath">Sigil Path (optional)</Label>
                <Input
                  id="create-sigilPath"
                  value={formData.sigilPath}
                  onChange={(e) => setFormData({ ...formData, sigilPath: e.target.value })}
                  placeholder="e.g., /assets/generated/sigil-moon.dim_512x512.png"
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
        {clans.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No clans yet. Create your first clan to get started.
            </CardContent>
          </Card>
        ) : (
          clans.map((clan) => {
            const { description, metadata } = decodeClanMetadata(clan.description);
            return (
              <Card key={clan.id.toString()}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{clan.name}</CardTitle>
                      <CardDescription>Members: {clan.members.length}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(clan)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(clan.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  {metadata.sigilPath && (
                    <p className="text-xs text-muted-foreground mt-2">Sigil: {metadata.sigilPath}</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingClan} onOpenChange={(open) => !open && setEditingClan(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Clan</DialogTitle>
            <DialogDescription>Update clan information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-accentColor">Accent Color (optional)</Label>
              <Input
                id="edit-accentColor"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-glowClass">Glow Class (optional)</Label>
              <Input
                id="edit-glowClass"
                value={formData.glowClass}
                onChange={(e) => setFormData({ ...formData, glowClass: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sigilPath">Sigil Path (optional)</Label>
              <Input
                id="edit-sigilPath"
                value={formData.sigilPath}
                onChange={(e) => setFormData({ ...formData, sigilPath: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClan(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
