import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { EpisodesAdminPanel } from './panels/EpisodesAdminPanel';
import { CharactersAdminPanel } from './panels/CharactersAdminPanel';
import { ClansAdminPanel } from './panels/ClansAdminPanel';
import { GalleryAdminPanel } from './panels/GalleryAdminPanel';
import { NewsAdminPanel } from './panels/NewsAdminPanel';
import { ScriptsAdminPanel } from './panels/ScriptsAdminPanel';
import { TeamAdminPanel } from './panels/TeamAdminPanel';
import { LoginButton } from '../auth/LoginButton';
import { useIsCallerAdmin } from '../../hooks/useQueries';

export function AdminDashboardView() {
  const { data: isAdmin } = useIsCallerAdmin();
  
  const navigateToMain = () => {
    window.location.hash = '';
  };

  const handleProTabClick = () => {
    window.location.hash = 'pro';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl shadow-glow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={navigateToMain}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Site</span>
              </button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="border-border bg-card/50 backdrop-blur-sm shadow-glow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Content Management</CardTitle>
            <CardDescription>
              Manage all content for Whispers Of The White Moon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="episodes" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 mb-6">
                <TabsTrigger value="episodes">Episodes</TabsTrigger>
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="clans">Clans</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="scripts">Scripts</TabsTrigger>
                {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
                <TabsTrigger value="pro" onClick={handleProTabClick}>Pro</TabsTrigger>
              </TabsList>

              <TabsContent value="episodes" className="space-y-4">
                <EpisodesAdminPanel />
              </TabsContent>

              <TabsContent value="characters" className="space-y-4">
                <CharactersAdminPanel />
              </TabsContent>

              <TabsContent value="clans" className="space-y-4">
                <ClansAdminPanel />
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <GalleryAdminPanel />
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                <NewsAdminPanel />
              </TabsContent>

              <TabsContent value="scripts" className="space-y-4">
                <ScriptsAdminPanel />
              </TabsContent>

              {isAdmin && (
                <TabsContent value="team" className="space-y-4">
                  <TeamAdminPanel />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
