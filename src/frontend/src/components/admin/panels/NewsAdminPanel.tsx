import { useState } from 'react';
import { useGetAllNewsPosts, useCreateNewsPost, useUpdateNewsPost, useDeleteNewsPost } from '../../../hooks/useQueries';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import type { NewsPost } from '../../../backend';

export function NewsAdminPanel() {
  const { data: newsPosts = [], isLoading, error } = useGetAllNewsPosts();
  const createMutation = useCreateNewsPost();
  const updateMutation = useUpdateNewsPost();
  const deleteMutation = useDeleteNewsPost();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and content are required');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        content: formData.content,
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create news post');
    }
  };

  const handleUpdate = async () => {
    if (!editingPost || !formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and content are required');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingPost.id,
        title: formData.title,
        content: formData.content,
      });

      setEditingPost(null);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update news post');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this news post?')) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete news post');
    }
  };

  const openEditDialog = (post: NewsPost) => {
    setFormData({
      title: post.title,
      content: post.content,
    });
    setEditingPost(post);
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
        <AlertDescription>Failed to load news posts: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">News Posts</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add News Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New News Post</DialogTitle>
              <DialogDescription>Add a new news update</DialogDescription>
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
                  placeholder="News title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-content">Content</Label>
                <Textarea
                  id="create-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="News content"
                  rows={6}
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
        {newsPosts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No news posts yet. Create your first post to get started.
            </CardContent>
          </Card>
        ) : (
          newsPosts.map((post) => (
            <Card key={post.id.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      By {post.author} • {new Date(Number(post.timestamp) / 1000000).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit News Post</DialogTitle>
            <DialogDescription>Update news post information</DialogDescription>
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
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
