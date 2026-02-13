import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NewsPost, UserProfile, UserRole, Episode, Character, Clan, GalleryItem, Script, Visibility } from '../backend';
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
    mutationFn: async (data: {
      title: string;
      description: string;
      videoUrl: string;
      thumbnailUrl: string;
      explicitReleaseDate: bigint;
      runtime: bigint | null;
      visibility: Visibility;
      taggedCharacterIds: bigint[];
      writingComplete?: boolean;
      storyboardComplete?: boolean;
      voiceActingComplete?: boolean;
      animationComplete?: boolean;
      editingComplete?: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEpisode(
        data.title,
        data.description,
        data.videoUrl,
        data.thumbnailUrl,
        data.explicitReleaseDate,
        data.runtime,
        data.visibility,
        data.taggedCharacterIds,
        data.writingComplete ?? false,
        data.storyboardComplete ?? false,
        data.voiceActingComplete ?? false,
        data.animationComplete ?? false,
        data.editingComplete ?? false
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
    mutationFn: async (data: {
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
        data.id,
        data.title,
        data.description,
        data.videoUrl,
        data.thumbnailUrl,
        data.explicitReleaseDate,
        data.runtime,
        data.visibility,
        data.taggedCharacterIds,
        data.writingComplete,
        data.storyboardComplete,
        data.voiceActingComplete,
        data.animationComplete,
        data.editingComplete
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
    mutationFn: async (data: { name: string; bio: string; role: string; clanId: bigint | null; episodes: bigint[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCharacter(data.name, data.bio, data.role, data.clanId, data.episodes);
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
    mutationFn: async (data: { id: bigint; name: string; bio: string; role: string; clanId: bigint | null; episodes: bigint[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCharacter(data.id, data.name, data.bio, data.role, data.clanId, data.episodes);
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
    mutationFn: async (data: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClan(data.name, data.description);
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
    mutationFn: async (data: { id: bigint; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClan(data.id, data.name, data.description);
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

// Gallery Items Queries
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

export function useCreateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; imageUrl: string; description: string; creator: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGalleryItem(data.title, data.imageUrl, data.description, data.creator);
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
    mutationFn: async (data: { id: bigint; title: string; imageUrl: string; description: string; creator: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryItem(data.id, data.title, data.imageUrl, data.description, data.creator);
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

// News Posts Queries
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
    mutationFn: async (data: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNewsPost(data.title, data.content);
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
    mutationFn: async (data: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNewsPost(data.id, data.title, data.content);
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
      try {
        return await actor.getAllScripts();
      } catch (err: any) {
        if (err.message?.includes('Unauthorized')) {
          return [];
        }
        throw err;
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string; creator: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createScript(data.title, data.content, data.creator);
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
    mutationFn: async (data: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScript(data.id, data.title, data.content);
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

// Team Members Queries
export function useListTeamMembers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserRole]>>({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listTeamMembers();
      } catch (err: any) {
        if (err.message?.includes('Unauthorized')) {
          return [];
        }
        throw err;
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGrantRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.grantRole(data.principal, data.role);
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
