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
import { AlertCircle, Newspaper, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { GlowingGlassPanel } from '../common/GlowingGlassPanel';

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
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Show profile setup modal when user is authenticated but has no profile
  const shouldShowProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  // Open modal when conditions are met
  if (shouldShowProfileSetup && !showProfileSetup) {
    setShowProfileSetup(true);
  }

  const handleProfileSave = async () => {
    if (!profileName.trim()) return;

    try {
      await saveProfileMutation.mutateAsync({ name: profileName.trim() });
      setShowProfileSetup(false);
      setProfileName('');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleCreatePost = async (title: string, content: string) => {
    await createPostMutation.mutateAsync({ title, content });
  };

  const sortedPosts = posts
    ? [...posts].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <section id="news" className="relative py-32 md:py-40 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Newspaper className="w-12 h-12 text-primary" />
            <h2 className="text-5xl md:text-6xl font-black">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                News
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest announcements and developments
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Login Button */}
          {!isAuthenticated && (
            <div className="flex justify-center">
              <LoginButton />
            </div>
          )}

          {/* Admin Post Creation Form */}
          {isAuthenticated && isAdmin && (
            <NewPostForm
              onSubmit={handleCreatePost}
              isSubmitting={createPostMutation.isPending}
              error={createPostMutation.error?.message || null}
            />
          )}

          {/* Loading State */}
          {postsLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <GlowingGlassPanel key={i} className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </GlowingGlassPanel>
              ))}
            </div>
          )}

          {/* Error State */}
          {postsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load news posts. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {/* News Posts */}
          {!postsLoading && !postsError && sortedPosts.length > 0 && (
            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <NewsPostCard key={post.id.toString()} post={post} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!postsLoading && !postsError && sortedPosts.length === 0 && (
            <GlowingGlassPanel className="p-12 text-center">
              <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                No news posts yet. Check back soon for updates!
              </p>
            </GlowingGlassPanel>
          )}
        </div>
      </div>

      {/* Profile Setup Modal */}
      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome! Set up your profile</DialogTitle>
            <DialogDescription>
              Please enter your name to continue. This will be displayed with your posts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Your Name</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name..."
                disabled={saveProfileMutation.isPending}
              />
            </div>
            <Button
              onClick={handleProfileSave}
              disabled={!profileName.trim() || saveProfileMutation.isPending}
              className="w-full"
            >
              {saveProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
