import { useState } from 'react';
import { useGetAllCharacters, useCreateCharacter, useUpdateCharacter, useDeleteCharacter, useGetAllClans } from '../../../hooks/useQueries';
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
import { encodeCharacterMetadata, decodeCharacterMetadata } from '../../../utils/adminContentAdapters';
import type { Character } from '../../../backend';

export function CharactersAdminPanel() {
  const { data: characters = [], isLoading, error } = useGetAllCharacters();
  const { data: clans = [] } = useGetAllClans();
  const createMutation = useCreateCharacter();
  const updateMutation = useUpdateCharacter();
  const deleteMutation = useDeleteCharacter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    role: '',
    clanId: null as bigint | null,
    personality: '',
    power: '',
    clan: '',
  });
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      role: '',
      clanId: null,
      personality: '',
      power: '',
      clan: '',
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.role.trim()) {
      setFormError('Name and role are required');
      return;
    }

    try {
      const encodedBio = encodeCharacterMetadata(formData.bio, {
        personality: formData.personality,
        power: formData.power,
        clan: formData.clan,
      });

      await createMutation.mutateAsync({
        name: formData.name,
        bio: encodedBio,
        role: formData.role,
        clanId: formData.clanId,
        episodes: [],
        portraitUrl: '',
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create character');
    }
  };

  const handleUpdate = async () => {
    if (!editingCharacter || !formData.name.trim() || !formData.role.trim()) {
      setFormError('Name and role are required');
      return;
    }

    try {
      const encodedBio = encodeCharacterMetadata(formData.bio, {
        personality: formData.personality,
        power: formData.power,
        clan: formData.clan,
      });

      await updateMutation.mutateAsync({
        id: editingCharacter.id,
        name: formData.name,
        bio: encodedBio,
        role: formData.role,
        clanId: formData.clanId,
        episodes: editingCharacter.episodes,
        portraitUrl: editingCharacter.portraitUrl,
      });

      setEditingCharacter(null);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update character');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete character');
    }
  };

  const openEditDialog = (character: Character) => {
    const { bio, metadata } = decodeCharacterMetadata(character.bio);
    setFormData({
      name: character.name,
      bio,
      role: character.role,
      clanId: character.clanId ?? null,
      personality: metadata.personality || '',
      power: metadata.power || '',
      clan: metadata.clan || '',
    });
    setEditingCharacter(character);
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
        <AlertDescription>Failed to load characters: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Characters</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Character
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Character</DialogTitle>
              <DialogDescription>Add a new character to the series</DialogDescription>
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
                  placeholder="Character name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-clan-name">Clan Name (display)</Label>
                <Input
                  id="create-clan-name"
                  value={formData.clan}
                  onChange={(e) => setFormData({ ...formData, clan: e.target.value })}
                  placeholder="e.g., Moon Clan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-clanId">Clan ID (optional)</Label>
                <Select
                  value={formData.clanId?.toString() || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, clanId: value === 'none' ? null : BigInt(value) })}
                >
                  <SelectTrigger id="create-clanId">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Clan</SelectItem>
                    {clans.map((clan) => (
                      <SelectItem key={clan.id.toString()} value={clan.id.toString()}>
                        {clan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-personality">Personality</Label>
                <Textarea
                  id="create-personality"
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  placeholder="Character personality"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-power">Power</Label>
                <Textarea
                  id="create-power"
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                  placeholder="Character powers and abilities"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <Input
                  id="create-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Character role in the story"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-bio">Bio (optional)</Label>
                <Textarea
                  id="create-bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Additional character bio"
                  rows={2}
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
        {characters.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No characters yet. Create your first character to get started.
            </CardContent>
          </Card>
        ) : (
          characters.map((character) => {
            const { bio, metadata } = decodeCharacterMetadata(character.bio);
            return (
              <Card key={character.id.toString()}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-start">
                      {character.portraitUrl && (
                        <img
                          src={character.portraitUrl}
                          alt={character.name}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-border"
                        />
                      )}
                      <div>
                        <CardTitle>{character.name}</CardTitle>
                        <CardDescription>{metadata.clan || 'Unknown Clan'}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(character)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(character.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Role:</strong> {character.role}</p>
                  {metadata.personality && <p className="text-sm text-muted-foreground">{metadata.personality}</p>}
                  {metadata.power && <p className="text-sm text-muted-foreground"><strong>Power:</strong> {metadata.power}</p>}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCharacter} onOpenChange={(open) => !open && setEditingCharacter(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
            <DialogDescription>Update character information</DialogDescription>
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
              <Label htmlFor="edit-clan-name">Clan Name (display)</Label>
              <Input
                id="edit-clan-name"
                value={formData.clan}
                onChange={(e) => setFormData({ ...formData, clan: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-clanId">Clan ID (optional)</Label>
              <Select
                value={formData.clanId?.toString() || 'none'}
                onValueChange={(value) => setFormData({ ...formData, clanId: value === 'none' ? null : BigInt(value) })}
              >
                <SelectTrigger id="edit-clanId">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Clan</SelectItem>
                  {clans.map((clan) => (
                    <SelectItem key={clan.id.toString()} value={clan.id.toString()}>
                      {clan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-personality">Personality</Label>
              <Textarea
                id="edit-personality"
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-power">Power</Label>
              <Textarea
                id="edit-power"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio (optional)</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCharacter(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
