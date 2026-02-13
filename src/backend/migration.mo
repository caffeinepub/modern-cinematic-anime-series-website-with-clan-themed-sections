import List "mo:core/List";

module {
  public type OldActor = {
    episodes : List.List<OldEpisode>;
    nextEpisodeId : Nat;
    characters : List.List<OldCharacter>;
    nextCharacterId : Nat;
    clans : List.List<OldClan>;
    nextClanId : Nat;
    galleryItems : List.List<OldGalleryItem>;
    nextGalleryItemId : Nat;
    newsPosts : List.List<OldNewsPost>;
    nextNewsPostId : Nat;
    scripts : List.List<OldScript>;
    nextScriptId : Nat;
    // Add other actor state as needed
  };

  public type OldEpisode = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    releaseDate : Int;
    writingComplete : Bool;
    storyboardComplete : Bool;
    voiceActingComplete : Bool;
    animationComplete : Bool;
    editingComplete : Bool;
    released : Bool;
  };

  public type OldCharacter = {
    id : Nat;
    name : Text;
    bio : Text;
    role : Text;
    clanId : ?Nat;
    episodes : [Nat];
  };

  public type OldClan = {
    id : Nat;
    name : Text;
    description : Text;
    members : [Nat];
  };

  public type OldGalleryItem = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    description : Text;
    creator : Text;
    date : Int;
  };

  public type OldNewsPost = {
    id : Nat;
    author : Text;
    title : Text;
    content : Text;
    timestamp : Int;
  };

  public type OldScript = {
    id : Nat;
    title : Text;
    content : Text;
    creator : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type NewActor = {
    episodes : List.List<NewEpisode>;
    nextEpisodeId : Nat;
    characters : List.List<OldCharacter>;
    nextCharacterId : Nat;
    clans : List.List<OldClan>;
    nextClanId : Nat;
    galleryItems : List.List<OldGalleryItem>;
    nextGalleryItemId : Nat;
    newsPosts : List.List<OldNewsPost>;
    nextNewsPostId : Nat;
    scripts : List.List<OldScript>;
    nextScriptId : Nat;
    // Add other new actor state as needed
  };

  public type NewEpisode = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    explicitReleaseDate : Int;
    runtime : ?Nat;
    visibility : NewVisibility;
    taggedCharacterIds : [Nat];
    order : Nat;
    writingComplete : Bool;
    storyboardComplete : Bool;
    voiceActingComplete : Bool;
    animationComplete : Bool;
    editingComplete : Bool;
    released : Bool;
  };

  public type NewVisibility = {
    #draft;
    #scheduled;
    #publicVisibility;
  };

  public func run(old : OldActor) : NewActor {
    let newEpisodes = old.episodes.map<OldEpisode, NewEpisode>(
      func(oldEp) {
        {
          id = oldEp.id;
          title = oldEp.title;
          description = oldEp.description;
          videoUrl = oldEp.videoUrl;
          thumbnailUrl = oldEp.thumbnailUrl;
          explicitReleaseDate = oldEp.releaseDate;
          runtime = null;
          visibility = if (oldEp.released) { #publicVisibility } else { #draft };
          taggedCharacterIds = [];
          order = oldEp.id;
          writingComplete = oldEp.writingComplete;
          storyboardComplete = oldEp.storyboardComplete;
          voiceActingComplete = oldEp.voiceActingComplete;
          animationComplete = oldEp.animationComplete;
          editingComplete = oldEp.editingComplete;
          released = oldEp.released;
        };
      }
    );

    {
      old with
      episodes = newEpisodes
    };
  };
};
