import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { EpisodesAdminPanel } from './panels/EpisodesAdminPanel';
import { CharactersAdminPanel } from './panels/CharactersAdminPanel';
import { ClansAdminPanel } from './panels/ClansAdminPanel';
import { GalleryAdminPanel } from './panels/GalleryAdminPanel';
import { NewsAdminPanel } from './panels/NewsAdminPanel';
import { ScriptsAdminPanel } from './panels/ScriptsAdminPanel';
import { TeamAdminPanel } from './panels/TeamAdminPanel';
import { FanMailAdminPanel } from './panels/FanMailAdminPanel';
import { CollaborationAdminPanel } from './panels/CollaborationAdminPanel';
import { SupporterHelpAdminPanel } from './panels/SupporterHelpAdminPanel';

export function AdminDashboardView() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your content and settings</p>
        </div>

        <Tabs defaultValue="episodes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-2">
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="clans">Clans</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="fanmail">Fan Mail</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
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

          <TabsContent value="team" className="space-y-4">
            <TeamAdminPanel />
          </TabsContent>

          <TabsContent value="fanmail" className="space-y-4">
            <FanMailAdminPanel />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-4">
            <CollaborationAdminPanel />
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <SupporterHelpAdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
