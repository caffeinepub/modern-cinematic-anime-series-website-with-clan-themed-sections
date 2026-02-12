import { useState } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  useGetAllNewsPosts,
  useCreateNewsPost,
  useIsCallerAdmin,
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from '../../hooks/useQueries';
import { NewsPostCard } from '../news/NewsPostCard';
import { NewPostForm } from '../news/NewPostForm';
import { LoginButton } from '../auth/LoginButton';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Newspaper } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function NewsUpdatesSection() {
  const { ref, isVisible } = useRevealOnScroll();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: posts, isLoading: postsLoading, error: postsError } = useGetAllNewsPosts();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  const createPostMutation = useCreateNewsPost();

  const [profileName, setProfileName] = useState('');
  const [profileError, setProfileError] = useState('');

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');

    if (!profileName.trim()) {
      setProfileError('Name is required');
      return;
    }

    try {
      await saveProfileMutation.mutateAsync({ name: profileName.trim() });
      setProfileName('');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save profile');
    }
  };

  const handleCreatePost = async (title: string, content: string) => {
    await createPostMutation.mutateAsync({ title, content });
  };

  const sortedPosts = posts ? [...posts].sort((a, b) => Number(b.timestamp - a.timestamp)) : [];

  return (
    <section
      id="news"
      ref={ref}
      className={`py-24 px-4 bg-gradient-to-b from-background via-background/95 to-background ${
        isVisible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              News & Updates
            </span>
          </h2>
          <LoginButton />
        </div>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
          Stay up to date with the latest announcements, episode releases, and behind-the-scenes content.
        </p>

        {/* Profile Setup Modal */}
        <Dialog open={showProfileSetup} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Welcome!</DialogTitle>
              <DialogDescription>Please enter your name to continue.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your name..."
                  disabled={saveProfileMutation.isPending}
                />
              </div>
              <Button type="submit" className="w-full" disabled={saveProfileMutation.isPending}>
                {saveProfileMutation.isPending ? 'Saving...' : 'Continue'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="space-y-8">
          {/* Creator Post Form */}
          {isAuthenticated && !adminLoading && isAdmin && (
            <NewPostForm
              onSubmit={handleCreatePost}
              isSubmitting={createPostMutation.isPending}
              error={createPostMutation.error?.message || null}
            />
          )}

          {/* Posts Feed */}
          {postsLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : postsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load news posts. Please try again later.
              </AlertDescription>
            </Alert>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Check back soon for updates and announcements!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <NewsPostCard key={post.id.toString()} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
