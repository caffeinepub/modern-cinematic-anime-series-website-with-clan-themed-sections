import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NewsPost, UserProfile, UserRole, Episode, Character, Clan, GalleryItem, Script, Visibility, FanMailMessage, CollaborationRequest, SupportRequest } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// News Queries
export function useGetAllNewsPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<NewsPost[]>({
    queryKey: ['newsPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNewsPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNewsPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNewsPost(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsPosts'] });
    },
  });
}

export function useUpdateNewsPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNewsPost(id, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsPosts'] });
    },
  });
}

export function useDeleteNewsPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNewsPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsPosts'] });
    },
  });
}

// Episodes Queries
export function useGetAllEpisodes() {
  const { actor, isFetching } = useActor();

  return useQuery<Episode[]>({
    queryKey: ['episodes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEpisodes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episode: {
      title: string;
      description: string;
      videoUrl: string;
      thumbnailUrl: string;
      explicitReleaseDate: bigint;
      runtime: bigint | null;
      visibility: Visibility;
      taggedCharacterIds: bigint[];
      writingComplete: boolean;
      storyboardComplete: boolean;
      voiceActingComplete: boolean;
      animationComplete: boolean;
      editingComplete: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEpisode(
        episode.title,
        episode.description,
        episode.videoUrl,
        episode.thumbnailUrl,
        episode.explicitReleaseDate,
        episode.runtime,
        episode.visibility,
        episode.taggedCharacterIds,
        episode.writingComplete,
        episode.storyboardComplete,
        episode.voiceActingComplete,
        episode.animationComplete,
        episode.editingComplete
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useUpdateEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episode: {
      id: bigint;
      title: string;
      description: string;
      videoUrl: string;
      thumbnailUrl: string;
      explicitReleaseDate: bigint;
      runtime: bigint | null;
      visibility: Visibility;
      taggedCharacterIds: bigint[];
      writingComplete: boolean;
      storyboardComplete: boolean;
      voiceActingComplete: boolean;
      animationComplete: boolean;
      editingComplete: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEpisode(
        episode.id,
        episode.title,
        episode.description,
        episode.videoUrl,
        episode.thumbnailUrl,
        episode.explicitReleaseDate,
        episode.runtime,
        episode.visibility,
        episode.taggedCharacterIds,
        episode.writingComplete,
        episode.storyboardComplete,
        episode.voiceActingComplete,
        episode.animationComplete,
        episode.editingComplete
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useDeleteEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEpisode(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useReorderEpisodes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: bigint[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reorderEpisodes(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

// Characters Queries
export function useGetAllCharacters() {
  const { actor, isFetching } = useActor();

  return useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCharacters();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: {
      name: string;
      bio: string;
      role: string;
      clanId: bigint | null;
      episodes: bigint[];
      portraitUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCharacter(
        character.name,
        character.bio,
        character.role,
        character.clanId,
        character.episodes,
        character.portraitUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useUpdateCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: {
      id: bigint;
      name: string;
      bio: string;
      role: string;
      clanId: bigint | null;
      episodes: bigint[];
      portraitUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCharacter(
        character.id,
        character.name,
        character.bio,
        character.role,
        character.clanId,
        character.episodes,
        character.portraitUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useDeleteCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCharacter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

// Clans Queries
export function useGetAllClans() {
  const { actor, isFetching } = useActor();

  return useQuery<Clan[]>({
    queryKey: ['clans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClan(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clans'] });
    },
  });
}

export function useUpdateClan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: bigint; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClan(id, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clans'] });
    },
  });
}

export function useDeleteClan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clans'] });
    },
  });
}

// Gallery Queries
export function useGetAllGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

// Featured Gallery Items (client-side filter)
export function useGetFeaturedGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['featuredGalleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllGalleryItems();
      return items.filter(item => item.featured);
    },
    enabled: !!actor && !isFetching,
  });
}

// Filter Gallery Items (using backend method)
export function useFilterGalleryItems(
  characterIds: bigint[],
  clanIds: bigint[],
  sortByPopularity: boolean,
  featuredOnly: boolean
) {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: [
      'filteredGalleryItems',
      characterIds.map(id => id.toString()),
      clanIds.map(id => id.toString()),
      sortByPopularity,
      featuredOnly
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterGalleryItems(characterIds, clanIds, sortByPopularity, featuredOnly);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      title: string;
      artistName: string;
      artworkTitle: string;
      description: string | null;
      creditLink: string | null;
      imageUrl: string;
      creator: string;
      featured: boolean;
      taggedCharacterIds: bigint[];
      taggedClanIds: bigint[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGalleryItem(
        item.title,
        item.artistName,
        item.artworkTitle,
        item.description,
        item.creditLink,
        item.imageUrl,
        item.creator,
        item.featured,
        item.taggedCharacterIds,
        item.taggedClanIds
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['artistLeaderboard'] });
    },
  });
}

export function useUpdateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      id: bigint;
      title: string;
      artistName: string;
      artworkTitle: string;
      description: string | null;
      creditLink: string | null;
      imageUrl: string;
      creator: string;
      featured: boolean;
      taggedCharacterIds: bigint[];
      taggedClanIds: bigint[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryItem(
        item.id,
        item.title,
        item.artistName,
        item.artworkTitle,
        item.description,
        item.creditLink,
        item.imageUrl,
        item.creator,
        item.featured,
        item.taggedCharacterIds,
        item.taggedClanIds
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['artistLeaderboard'] });
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['artistLeaderboard'] });
    },
  });
}

export function useSubmitFanArt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      title: string;
      artistName: string;
      artworkTitle: string;
      description: string | null;
      creditLink: string | null;
      imageUrl: string;
      creator: string;
      taggedCharacterIds: bigint[];
      taggedClanIds: bigint[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFanArt(
        item.title,
        item.artistName,
        item.artworkTitle,
        item.description,
        item.creditLink,
        item.imageUrl,
        item.creator,
        item.taggedCharacterIds,
        item.taggedClanIds
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryItems'] });
      queryClient.invalidateQueries({ queryKey: ['artistLeaderboard'] });
    },
  });
}

export function useIncrementGalleryItemViewCount() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementGalleryItemViewCount(id);
    },
  });
}

// Artist Leaderboard (computed from gallery items)
export function useGetArtistLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['artistLeaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllGalleryItems();
      
      // Group by artist and compute stats
      const artistMap = new Map<string, {
        artistName: string;
        totalVotes: number;
        submittedCount: number;
        featuredCount: number;
        badges: string[];
      }>();

      items.forEach(item => {
        const existing = artistMap.get(item.artistName) || {
          artistName: item.artistName,
          totalVotes: 0,
          submittedCount: 0,
          featuredCount: 0,
          badges: [],
        };

        existing.totalVotes += Number(item.popularity);
        existing.submittedCount += 1;
        if (item.featured) existing.featuredCount += 1;

        artistMap.set(item.artistName, existing);
      });

      // Convert to array and sort by votes
      const leaderboard = Array.from(artistMap.values())
        .sort((a, b) => b.totalVotes - a.totalVotes)
        .map((entry, index) => {
          const badges: string[] = [];
          
          // Award badges based on performance
          if (entry.submittedCount >= 10 && entry.totalVotes < 100) {
            badges.push('Rising Artist');
          }
          if (entry.totalVotes >= 100) {
            badges.push('Community Favorite');
          }
          if (entry.featuredCount >= 3) {
            badges.push('Monthly Champion');
          }
          if (entry.submittedCount >= 50 && entry.featuredCount >= 10) {
            badges.push('Legendary Creator');
          }

          return {
            ...entry,
            rank: index + 1,
            badges,
          };
        });

      return leaderboard;
    },
    enabled: !!actor && !isFetching,
  });
}

// Artist Profile (computed from gallery items)
export function useGetArtistProfile(artistName: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['artistProfile', artistName],
    queryFn: async () => {
      if (!actor) return null;
      const items = await actor.getAllGalleryItems();
      
      const artistItems = items.filter(item => item.artistName === artistName);
      
      if (artistItems.length === 0) return null;

      const totalVotes = artistItems.reduce((sum, item) => sum + Number(item.popularity), 0);
      const featuredCount = artistItems.filter(item => item.featured).length;

      const badges: string[] = [];
      if (artistItems.length >= 10 && totalVotes < 100) {
        badges.push('Rising Artist');
      }
      if (totalVotes >= 100) {
        badges.push('Community Favorite');
      }
      if (featuredCount >= 3) {
        badges.push('Monthly Champion');
      }
      if (artistItems.length >= 50 && featuredCount >= 10) {
        badges.push('Legendary Creator');
      }

      return {
        artistName,
        totalVotes,
        submittedCount: artistItems.length,
        featuredCount,
        badges,
        artworks: artistItems,
      };
    },
    enabled: !!actor && !isFetching && !!artistName,
  });
}

// Scripts Queries
export function useGetAllScripts() {
  const { actor, isFetching } = useActor();

  return useQuery<Script[]>({
    queryKey: ['scripts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScripts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, creator }: { title: string; content: string; creator: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createScript(title, content, creator);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}

export function useUpdateScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScript(id, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}

export function useDeleteScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScript(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}

// Team Member Queries
export function useListTeamMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<[Principal, UserRole][]>({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTeamMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGrantRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, role }: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.grantRole(principal, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
}

export function useRevokeRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.revokeRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
}

// Pro Presentation Queries
export function useGetProPresentation() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['proPresentation'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getProPresentation();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProPresentation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProPresentation(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proPresentation'] });
    },
  });
}

// Fan Mail Queries
export function useSubmitFanMail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, message }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFanMail(name, email, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanMail'] });
    },
  });
}

export function useGetAllFanMail() {
  const { actor, isFetching } = useActor();

  return useQuery<FanMailMessage[]>({
    queryKey: ['fanMail'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFanMail();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReplyToFanMail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reply }: { id: bigint; reply: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.replyToFanMail(id, reply);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanMail'] });
    },
  });
}

// Collaboration Queries
export function useSubmitCollaboration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, company, email, message }: { name: string; company: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCollaboration(name, company, email, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] });
    },
  });
}

export function useGetAllCollaborations() {
  const { actor, isFetching } = useActor();

  return useQuery<CollaborationRequest[]>({
    queryKey: ['collaborations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCollaborations();
    },
    enabled: !!actor && !isFetching,
  });
}

// Supporter Help Queries
export function useSubmitSupporterHelp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, company, email, subject, product, serial, message }: { name: string; company: string; email: string; subject: string; product: string; serial: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSupportRequest(name, company, email, subject, product, serial, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportRequests'] });
    },
  });
}

export function useGetAllSupportRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<SupportRequest[]>({
    queryKey: ['supportRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSupport();
    },
    enabled: !!actor && !isFetching,
  });
}
