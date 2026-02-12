import { useState } from 'react';
import { useGetAllScripts, useCreateScript, useUpdateScript, useDeleteScript } from '../../../hooks/useQueries';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { Plus, Edit, Trash2, AlertCircle, FileText } from 'lucide-react';
import type { Script } from '../../../backend';

export function ScriptsAdminPanel() {
  const { data: scripts = [], isLoading, error } = useGetAllScripts();
  const createMutation = useCreateScript();
  const updateMutation = useUpdateScript();
  const deleteMutation = useDeleteScript();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    creator: '',
  });
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      creator: '',
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.creator.trim()) {
      setFormError('Title, content, and creator are required');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        content: formData.content,
        creator: formData.creator,
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create script';
      if (errorMsg.includes('Unauthorized')) {
        setFormError('You do not have permission to create scripts');
      } else {
        setFormError(errorMsg);
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingScript || !formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and content are required');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingScript.id,
        title: formData.title,
        content: formData.content,
      });

      setEditingScript(null);
      resetForm();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update script';
      if (errorMsg.includes('Unauthorized')) {
        setFormError('You do not have permission to update scripts');
      } else {
        setFormError(errorMsg);
      }
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this script?')) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete script';
      if (errorMsg.includes('Unauthorized')) {
        alert('You do not have permission to delete scripts');
      } else {
        alert(errorMsg);
      }
    }
  };

  const openEditDialog = (script: Script) => {
    setFormData({
      title: script.title,
      content: script.content,
      creator: script.creator,
    });
    setEditingScript(script);
    setFormError('');
  };

  const closeEditDialog = () => {
    setEditingScript(null);
    resetForm();
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
        <AlertDescription>
          Failed to load scripts. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Scripts</h3>
          <p className="text-sm text-muted-foreground">
            Manage episode scripts and screenplays
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Script
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Script</DialogTitle>
              <DialogDescription>
                Add a new script or screenplay to the collection
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="create-title">Title *</Label>
                <Input
                  id="create-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Episode 1: The Beginning"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-creator">Creator *</Label>
                <Input
                  id="create-creator"
                  value={formData.creator}
                  onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                  placeholder="Writer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-content">Script Content *</Label>
                <Textarea
                  id="create-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the script content here..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Script'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scripts List */}
      {scripts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No scripts yet. Create your first script to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scripts.map((script) => (
            <Card key={script.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{script.title}</CardTitle>
                    <CardDescription>
                      By {script.creator} • Created {new Date(Number(script.createdAt) / 1000000).toLocaleDateString()}
                      {script.updatedAt !== script.createdAt && (
                        <> • Updated {new Date(Number(script.updatedAt) / 1000000).toLocaleDateString()}</>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(script)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(script.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-md p-4 max-h-[200px] overflow-y-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                    {script.content.length > 500
                      ? script.content.substring(0, 500) + '...'
                      : script.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingScript} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Script</DialogTitle>
            <DialogDescription>
              Update the script details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Episode 1: The Beginning"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-creator">Creator</Label>
              <Input
                id="edit-creator"
                value={formData.creator}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Script Content *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter the script content here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditDialog}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
