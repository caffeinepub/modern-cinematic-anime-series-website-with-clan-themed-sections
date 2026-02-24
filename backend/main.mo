import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let BADGE_UNLOCK_TYPE = {
    characterMatch = 0 : Nat8;
    clanLoyalty = 1;
    secretCombo = 2;
  };

  let BADGE_RARITY = {
    common = 0 : Nat8;
    rare = 1;
    epic = 2;
    legendary = 3;
  };

  public type CollaborationRequest = {
    id : Nat;
    name : Text;
    company : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  public type SupportRequest = {
    id : Nat;
    name : Text;
    company : Text;
    email : Text;
    subject : Text;
    product : Text;
    serial : Text;
    message : Text;
    timestamp : Int;
  };

  public type Visibility = {
    #draft;
    #scheduled;
    #publicVisibility;
  };

  public type Episode = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    explicitReleaseDate : Int;
    runtime : ?Nat;
    visibility : Visibility;
    taggedCharacterIds : [Nat];
    order : Nat;
    writingComplete : Bool;
    storyboardComplete : Bool;
    voiceActingComplete : Bool;
    animationComplete : Bool;
    editingComplete : Bool;
    released : Bool;
  };

  public type Character = {
    id : Nat;
    name : Text;
    bio : Text;
    role : Text;
    clanId : ?Nat;
    episodes : [Nat];
    portraitUrl : Text;
  };

  public type Clan = {
    id : Nat;
    name : Text;
    description : Text;
    members : [Nat];
  };

  public type GalleryItem = {
    id : Nat;
    title : Text;
    artistName : Text;
    artworkTitle : Text;
    description : ?Text;
    creditLink : ?Text;
    imageUrl : Text;
    creator : Text;
    date : Int;
    featured : Bool;
    taggedCharacterIds : [Nat];
    taggedClanIds : [Nat];
    popularity : Nat;
    viewCount : Nat;
  };

  public type NewsPost = {
    id : Nat;
    author : Text;
    title : Text;
    content : Text;
    timestamp : Int;
  };

  public type Script = {
    id : Nat;
    title : Text;
    content : Text;
    creator : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type BlockType = {
    #title;
    #text;
    #image;
    #data;
    #section;
    #list;
    #episode;
    #character;
    #progress;
  };

  public type ProBlockData = {
    id : Text;
    blockType : BlockType;
    content : Text;
    title : Text;
    subTitle : ?Text;
    position : Nat;
    width : Nat;
    height : Nat;
    color : ?Text;
    transparent : Bool;
    episode : ?Nat;
    meta : ?Text;
    dataset : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type FanMailMessage = {
    id : Nat;
    senderName : Text;
    senderEmail : Text;
    message : Text;
    submittedAt : Int;
    adminReply : ?Text;
  };

  // Badges
  public type Badge = {
    id : Text;
    name : Text;
    emoji : Text;
    tagline : Text;
    unlockType : Nat8;
    unlockCondition : Text;
    rarity : Nat8;
  };

  public type UserBadge = {
    badgeId : Text;
    earnedAt : Int;
  };

  let episodes = List.empty<Episode>();
  var nextEpisodeId = 0;
  let characters = List.empty<Character>();
  var nextCharacterId = 0;
  let clans = List.empty<Clan>();
  var nextClanId = 0;
  let galleryItems = List.empty<GalleryItem>();
  var nextGalleryItemId = 0;
  let galleryImages = List.empty<BlobStorage.ExternalBlob>();
  let newsPosts = List.empty<NewsPost>();
  var nextNewsPostId = 0;
  let scripts = List.empty<Script>();
  var nextScriptId = 0;
  let proBlocks = List.empty<ProBlockData>();
  var proPresentation : Text = "";
  let fanMails = List.empty<FanMailMessage>();
  var nextFanMailId = 0;
  let collaborations = List.empty<CollaborationRequest>();
  var collaborationId = 0;
  let supportRequests = List.empty<SupportRequest>();
  var supportRequestId = 0;
  let badgeDefinitions = Map.empty<Text, Badge>();
  let userBadges = Map.empty<Principal, [UserBadge]>();
  let oldCharacterQuizMapping = Map.empty<Nat, Text>();
};
