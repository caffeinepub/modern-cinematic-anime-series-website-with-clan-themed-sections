import { useState } from 'react';
import { useCreateCharacter, useGetAllClans } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { encodeCharacterMetadata } from '../../utils/adminContentAdapters';

interface CreateCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCharacterDialog({ open, onOpenChange }: CreateCharacterDialogProps) {
  const { data: clans = [] } = useGetAllClans();
  const createMutation = useCreateCharacter();

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

      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create character');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
