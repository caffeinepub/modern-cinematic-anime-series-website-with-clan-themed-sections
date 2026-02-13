import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Storage";

module {
  type UserProfile = {
    name : Text;
  };

  type Visibility = {
    #draft;
    #scheduled;
    #publicVisibility;
  };

  type Episode = {
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

  type OldCharacter = {
    id : Nat;
    name : Text;
    bio : Text;
    role : Text;
    clanId : ?Nat;
    episodes : [Nat];
  };

  type NewCharacter = {
    id : Nat;
    name : Text;
    bio : Text;
    role : Text;
    clanId : ?Nat;
    episodes : [Nat];
    portraitUrl : Text;
  };

  type Clan = {
    id : Nat;
    name : Text;
    description : Text;
    members : [Nat];
  };

  type GalleryItem = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    description : Text;
    creator : Text;
    date : Int;
  };

  type NewsPost = {
    id : Nat;
    author : Text;
    title : Text;
    content : Text;
    timestamp : Int;
  };

  type Script = {
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

  type ProBlockData = {
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

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    episodes : List.List<Episode>;
    nextEpisodeId : Nat;
    characters : List.List<OldCharacter>;
    nextCharacterId : Nat;
    clans : List.List<Clan>;
    nextClanId : Nat;
    galleryItems : List.List<GalleryItem>;
    nextGalleryItemId : Nat;
    galleryImages : List.List<BlobStorage.ExternalBlob>;
    newsPosts : List.List<NewsPost>;
    nextNewsPostId : Nat;
    scripts : List.List<Script>;
    nextScriptId : Nat;
    proBlocks : List.List<ProBlockData>;
    proPresentation : Text;
    accessControlState : AccessControl.AccessControlState;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    episodes : List.List<Episode>;
    nextEpisodeId : Nat;
    characters : List.List<NewCharacter>;
    nextCharacterId : Nat;
    clans : List.List<Clan>;
    nextClanId : Nat;
    galleryItems : List.List<GalleryItem>;
    nextGalleryItemId : Nat;
    galleryImages : List.List<BlobStorage.ExternalBlob>;
    newsPosts : List.List<NewsPost>;
    nextNewsPostId : Nat;
    scripts : List.List<Script>;
    nextScriptId : Nat;
    proBlocks : List.List<ProBlockData>;
    proPresentation : Text;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    let newCharacters = old.characters.map<OldCharacter, NewCharacter>(
      func(oldChar) {
        {
          oldChar with
          portraitUrl = ""; // Initialize with an empty string
        };
      }
    );
    { old with characters = newCharacters };
  };
};
