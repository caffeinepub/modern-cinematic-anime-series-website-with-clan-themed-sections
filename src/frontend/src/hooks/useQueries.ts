import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NewsPost, UserProfile, UserRole, Episode, Character, Clan, GalleryItem, Script, Visibility, FanMailMessage } from '../backend';
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

// Authorization Queries
export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Pro Presentation Queries
export function useGetProPresentation() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['proPresentation'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getProPresentation();
    },
    enabled: !!actor && !actorFetching,
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
    onError: (error) => {
      console.error('Pro presentation update failed:', error);
      throw error;
    },
  });
}

// Episodes Queries
export function useGetAllEpisodes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Episode[]>({
    queryKey: ['episodes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEpisodes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
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
        params.title,
        params.description,
        params.videoUrl,
        params.thumbnailUrl,
        params.explicitReleaseDate,
        params.runtime,
        params.visibility,
        params.taggedCharacterIds,
        params.writingComplete,
        params.storyboardComplete,
        params.voiceActingComplete,
        params.animationComplete,
        params.editingComplete
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
    mutationFn: async (params: {
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
        params.id,
        params.title,
        params.description,
        params.videoUrl,
        params.thumbnailUrl,
        params.explicitReleaseDate,
        params.runtime,
        params.visibility,
        params.taggedCharacterIds,
        params.writingComplete,
        params.storyboardComplete,
        params.voiceActingComplete,
        params.animationComplete,
        params.editingComplete
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
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCharacters();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      bio: string;
      role: string;
      clanId: bigint | null;
      episodes: bigint[];
      portraitUrl?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCharacter(
        params.name,
        params.bio,
        params.role,
        params.clanId,
        params.episodes,
        params.portraitUrl || ''
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
    mutationFn: async (params: {
      id: bigint;
      name: string;
      bio: string;
      role: string;
      clanId: bigint | null;
      episodes: bigint[];
      portraitUrl?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCharacter(
        params.id,
        params.name,
        params.bio,
        params.role,
        params.clanId,
        params.episodes,
        params.portraitUrl || ''
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
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Clan[]>({
    queryKey: ['clans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateClan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClan(params.name, params.description);
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
    mutationFn: async (params: { id: bigint; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClan(params.id, params.name, params.description);
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
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetFeaturedGalleryItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems', 'featured'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterGalleryItems([], [], false, true);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useFilterGalleryItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useMutation({
    mutationFn: async (params: {
      characterIds: bigint[];
      clanIds: bigint[];
      sortByPopularity: boolean;
      featuredOnly: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.filterGalleryItems(
        params.characterIds,
        params.clanIds,
        params.sortByPopularity,
        params.featuredOnly
      );
    },
  });
}

export function useCreateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
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
        params.title,
        params.artistName,
        params.artworkTitle,
        params.description,
        params.creditLink,
        params.imageUrl,
        params.creator,
        params.featured,
        params.taggedCharacterIds,
        params.taggedClanIds
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}

export function useUpdateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
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
        params.id,
        params.title,
        params.artistName,
        params.artworkTitle,
        params.description,
        params.creditLink,
        params.imageUrl,
        params.creator,
        params.featured,
        params.taggedCharacterIds,
        params.taggedClanIds
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
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
    },
  });
}

export function useIncrementGalleryItemViewCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementGalleryItemViewCount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}

// News Queries
export function useGetAllNewsPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewsPost[]>({
    queryKey: ['newsPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNewsPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateNewsPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNewsPost(params.title, params.content);
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
    mutationFn: async (params: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNewsPost(params.id, params.title, params.content);
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

// Scripts Queries
export function useGetAllScripts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Script[]>({
    queryKey: ['scripts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScripts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; content: string; creator: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createScript(params.title, params.content, params.creator);
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
    mutationFn: async (params: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScript(params.id, params.title, params.content);
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

// Team Management Queries
export function useListTeamMembers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserRole]>>({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTeamMembers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGrantRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.grantRole(params.principal, params.role);
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

// Fan Mail Queries
export function useGetAllFanMail() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FanMailMessage[]>({
    queryKey: ['fanMail'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFanMail();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitFanMail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFanMail(params.name, params.email, params.message);
    },
  });
}

export function useReplyToFanMail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; reply: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.replyToFanMail(params.id, params.reply);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanMail'] });
    },
  });
}
