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
export interface FanMailMessage {
    id: bigint;
    adminReply?: string;
    submittedAt: bigint;
    message: string;
    senderName: string;
    senderEmail: string;
}
export interface ProBlockData {
    id: string;
    height: bigint;
    title: string;
    dataset: string;
    content: string;
    transparent: boolean;
    meta?: string;
    createdAt: bigint;
    color?: string;
    blockType: BlockType;
    updatedAt: bigint;
    subTitle?: string;
    width: bigint;
    position: bigint;
    episode?: bigint;
}
export interface Character {
    id: bigint;
    bio: string;
    clanId?: bigint;
    episodes: Array<bigint>;
    name: string;
    role: string;
    portraitUrl: string;
}
export interface NewsPost {
    id: bigint;
    title: string;
    content: string;
    author: string;
    timestamp: bigint;
}
export interface Episode {
    id: bigint;
    taggedCharacterIds: Array<bigint>;
    writingComplete: boolean;
    title: string;
    thumbnailUrl: string;
    order: bigint;
    description: string;
    released: boolean;
    explicitReleaseDate: bigint;
    animationComplete: boolean;
    voiceActingComplete: boolean;
    storyboardComplete: boolean;
    visibility: Visibility;
    videoUrl: string;
    editingComplete: boolean;
    runtime?: bigint;
}
export interface Clan {
    id: bigint;
    members: Array<bigint>;
    name: string;
    description: string;
}
export interface SupportRequest {
    id: bigint;
    subject: string;
    name: string;
    serial: string;
    email: string;
    company: string;
    message: string;
    timestamp: bigint;
    product: string;
}
export interface Script {
    id: bigint;
    title: string;
    creator: string;
    content: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface CollaborationRequest {
    id: bigint;
    name: string;
    email: string;
    company: string;
    message: string;
    timestamp: bigint;
}
export interface GalleryItem {
    id: bigint;
    taggedCharacterIds: Array<bigint>;
    title: string;
    creator: string;
    featured: boolean;
    creditLink?: string;
    artworkTitle: string;
    date: bigint;
    description?: string;
    taggedClanIds: Array<bigint>;
    imageUrl: string;
    viewCount: bigint;
    artistName: string;
    popularity: bigint;
}
export interface UserProfile {
    name: string;
}
export enum BlockType {
    title = "title",
    character = "character",
    data = "data",
    list = "list",
    text = "text",
    section = "section",
    progress = "progress",
    image = "image",
    episode = "episode"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Visibility {
    scheduled = "scheduled",
    publicVisibility = "publicVisibility",
    draft = "draft"
}
export interface backendInterface {
    addMemberToClan(clanId: bigint, characterId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCharacter(name: string, bio: string, role: string, clanId: bigint | null, episodes: Array<bigint>, portraitUrl: string): Promise<void>;
    createClan(name: string, description: string): Promise<void>;
    createCollaboration(name: string, company: string, email: string, message: string): Promise<void>;
    createEpisode(title: string, description: string, videoUrl: string, thumbnailUrl: string, explicitReleaseDate: bigint, runtime: bigint | null, visibility: Visibility, taggedCharacterIds: Array<bigint>, writingComplete: boolean, storyboardComplete: boolean, voiceActingComplete: boolean, animationComplete: boolean, editingComplete: boolean): Promise<void>;
    createGalleryItem(title: string, artistName: string, artworkTitle: string, description: string | null, creditLink: string | null, imageUrl: string, creator: string, featured: boolean, taggedCharacterIds: Array<bigint>, taggedClanIds: Array<bigint>): Promise<void>;
    createNewsPost(title: string, content: string): Promise<void>;
    createScript(title: string, content: string, creator: string): Promise<void>;
    createSupportRequest(name: string, company: string, email: string, subject: string, product: string, serial: string, message: string): Promise<void>;
    deleteCharacter(id: bigint): Promise<void>;
    deleteClan(id: bigint): Promise<void>;
    deleteEpisode(id: bigint): Promise<void>;
    deleteGalleryItem(id: bigint): Promise<void>;
    deleteNewsPost(id: bigint): Promise<void>;
    deleteProBlock(id: string): Promise<void>;
    deleteScript(id: bigint): Promise<void>;
    filterGalleryItems(characterIds: Array<bigint>, clanIds: Array<bigint>, sortByPopularity: boolean, featuredOnly: boolean): Promise<Array<GalleryItem>>;
    getAllCharacters(): Promise<Array<Character>>;
    getAllClans(): Promise<Array<Clan>>;
    getAllCollaborations(): Promise<Array<CollaborationRequest>>;
    getAllEpisodes(): Promise<Array<Episode>>;
    getAllFanMail(): Promise<Array<FanMailMessage>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllNewsPosts(): Promise<Array<NewsPost>>;
    getAllProBlocks(): Promise<Array<ProBlockData>>;
    getAllScripts(): Promise<Array<Script>>;
    getAllSupport(): Promise<Array<SupportRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharacterById(id: bigint): Promise<Character | null>;
    getClanById(id: bigint): Promise<Clan | null>;
    getEpisodeById(id: bigint): Promise<Episode | null>;
    getFanMailById(id: bigint): Promise<FanMailMessage | null>;
    getGalleryImages(): Promise<Array<ExternalBlob>>;
    getGalleryItemById(id: bigint): Promise<GalleryItem | null>;
    getNewsPostById(id: bigint): Promise<NewsPost | null>;
    getNewsPostsByAuthor(author: string): Promise<Array<NewsPost>>;
    getProPresentation(): Promise<string>;
    getScriptById(id: bigint): Promise<Script | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantRole(principal: Principal, role: UserRole): Promise<void>;
    incrementGalleryItemViewCount(id: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listTeamMembers(): Promise<Array<[Principal, UserRole]>>;
    removeMemberFromClan(clanId: bigint, characterId: bigint): Promise<void>;
    reorderEpisodes(newOrder: Array<bigint>): Promise<void>;
    reorderProBlocks(newOrder: Array<string>): Promise<void>;
    replyToFanMail(id: bigint, reply: string): Promise<void>;
    revokeRole(principal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProBlock(block: ProBlockData): Promise<void>;
    submitFanArt(title: string, artistName: string, artworkTitle: string, description: string | null, creditLink: string | null, imageUrl: string, creator: string, taggedCharacterIds: Array<bigint>, taggedClanIds: Array<bigint>): Promise<void>;
    submitFanMail(name: string, email: string, message: string): Promise<void>;
    updateCharacter(id: bigint, name: string, bio: string, role: string, clanId: bigint | null, episodes: Array<bigint>, portraitUrl: string): Promise<void>;
    updateClan(id: bigint, name: string, description: string): Promise<void>;
    updateEpisode(id: bigint, title: string, description: string, videoUrl: string, thumbnailUrl: string, explicitReleaseDate: bigint, runtime: bigint | null, visibility: Visibility, taggedCharacterIds: Array<bigint>, writingComplete: boolean, storyboardComplete: boolean, voiceActingComplete: boolean, animationComplete: boolean, editingComplete: boolean): Promise<void>;
    updateGalleryItem(id: bigint, title: string, artistName: string, artworkTitle: string, description: string | null, creditLink: string | null, imageUrl: string, creator: string, featured: boolean, taggedCharacterIds: Array<bigint>, taggedClanIds: Array<bigint>): Promise<void>;
    updateNewsPost(id: bigint, title: string, content: string): Promise<void>;
    updateProBlock(id: string, block: ProBlockData): Promise<void>;
    updateProPresentation(content: string): Promise<void>;
    updateScript(id: bigint, title: string, content: string): Promise<void>;
}
