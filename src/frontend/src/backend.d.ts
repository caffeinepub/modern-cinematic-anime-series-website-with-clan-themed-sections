import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Episode {
    id: bigint;
    title: string;
    thumbnailUrl: string;
    description: string;
    videoUrl: string;
    releaseDate: bigint;
}
export interface Clan {
    id: bigint;
    members: Array<bigint>;
    name: string;
    description: string;
}
export interface Script {
    id: bigint;
    title: string;
    creator: string;
    content: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface GalleryItem {
    id: bigint;
    title: string;
    creator: string;
    date: bigint;
    description: string;
    imageUrl: string;
}
export interface Character {
    id: bigint;
    bio: string;
    clanId?: bigint;
    episodes: Array<bigint>;
    name: string;
    role: string;
}
export interface UserProfile {
    name: string;
}
export interface NewsPost {
    id: bigint;
    title: string;
    content: string;
    author: string;
    timestamp: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMemberToClan(clanId: bigint, characterId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCharacter(name: string, bio: string, role: string, clanId: bigint | null, episodes: Array<bigint>): Promise<void>;
    createClan(name: string, description: string): Promise<void>;
    createEpisode(title: string, description: string, videoUrl: string, thumbnailUrl: string, releaseDate: bigint): Promise<void>;
    createGalleryItem(title: string, imageUrl: string, description: string, creator: string): Promise<void>;
    createNewsPost(title: string, content: string): Promise<void>;
    createScript(title: string, content: string, creator: string): Promise<void>;
    deleteCharacter(id: bigint): Promise<void>;
    deleteClan(id: bigint): Promise<void>;
    deleteEpisode(id: bigint): Promise<void>;
    deleteGalleryItem(id: bigint): Promise<void>;
    deleteNewsPost(id: bigint): Promise<void>;
    deleteScript(id: bigint): Promise<void>;
    getAllCharacters(): Promise<Array<Character>>;
    getAllClans(): Promise<Array<Clan>>;
    getAllEpisodes(): Promise<Array<Episode>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllNewsPosts(): Promise<Array<NewsPost>>;
    getAllScripts(): Promise<Array<Script>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharacterById(id: bigint): Promise<Character | null>;
    getClanById(id: bigint): Promise<Clan | null>;
    getEpisodeById(id: bigint): Promise<Episode | null>;
    getGalleryImages(): Promise<Array<ExternalBlob>>;
    getGalleryItemById(id: bigint): Promise<GalleryItem | null>;
    getNewsPostById(id: bigint): Promise<NewsPost | null>;
    getNewsPostsByAuthor(author: string): Promise<Array<NewsPost>>;
    getScriptById(id: bigint): Promise<Script | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantRole(principal: Principal, role: UserRole): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listTeamMembers(): Promise<Array<[Principal, UserRole]>>;
    removeMemberFromClan(clanId: bigint, characterId: bigint): Promise<void>;
    revokeRole(principal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCharacter(id: bigint, name: string, bio: string, role: string, clanId: bigint | null, episodes: Array<bigint>): Promise<void>;
    updateClan(id: bigint, name: string, description: string): Promise<void>;
    updateEpisode(id: bigint, title: string, description: string, videoUrl: string, thumbnailUrl: string, releaseDate: bigint): Promise<void>;
    updateGalleryItem(id: bigint, title: string, imageUrl: string, description: string, creator: string): Promise<void>;
    updateNewsPost(id: bigint, title: string, content: string): Promise<void>;
    updateScript(id: bigint, title: string, content: string): Promise<void>;
}
