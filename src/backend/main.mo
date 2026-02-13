import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";


// Specify the migration function to run on upgrade by the with clause

actor {
  include MixinStorage();

  // Admin system state
  let accessControlState = AccessControl.initState();

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Episodes
  let episodes = List.empty<Episode>();
  var nextEpisodeId = 0;

  // Characters
  let characters = List.empty<Character>();
  var nextCharacterId = 0;

  // Clans
  let clans = List.empty<Clan>();
  var nextClanId = 0;

  // Gallery Items
  let galleryItems = List.empty<GalleryItem>();
  var nextGalleryItemId = 0;

  let galleryImages = List.empty<BlobStorage.ExternalBlob>();

  // News
  let newsPosts = List.empty<NewsPost>();
  var nextNewsPostId = 0;

  // Scripts (new)
  let scripts = List.empty<Script>();
  var nextScriptId = 0;

  // ProBlocks persistent store
  let proBlocks = List.empty<ProBlockData>();

  var proPresentation : Text = "";

  public type UserProfile = {
    name : Text;
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
    portraitUrl : Text; // New field for character portrait URL
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
    imageUrl : Text;
    description : Text;
    creator : Text;
    date : Int;
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

  // Persistent ProBlocks Store
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

  include MixinAuthorization(accessControlState);

  // Pro Presentation API
  public query ({ caller }) func getProPresentation() : async Text {
    proPresentation;
  };

  public shared ({ caller }) func updateProPresentation(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the Pro presentation");
    };
    proPresentation := content;
  };

  // Persistent ProBlocks API
  public query ({ caller }) func getAllProBlocks() : async [ProBlockData] {
    proBlocks.toArray();
  };

  public shared ({ caller }) func saveProBlock(block : ProBlockData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create pro blocks");
    };

    let currentTime = Time.now();

    let updatedBlock = {
      block with
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    proBlocks.add(updatedBlock);
  };

  public shared ({ caller }) func updateProBlock(id : Text, block : ProBlockData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update pro blocks");
    };

    proBlocks.mapInPlace(
      func(existingBlock) {
        if (existingBlock.id == id) {
          {
            block with
            createdAt = existingBlock.createdAt;
            updatedAt = Time.now();
          };
        } else {
          existingBlock;
        };
      }
    );
  };

  public shared ({ caller }) func deleteProBlock(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete pro blocks");
    };

    let filtered = proBlocks.filter(func(block) { block.id != id });
    proBlocks.clear();
    proBlocks.addAll(filtered.values());
  };

  public shared ({ caller }) func reorderProBlocks(newOrder : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reorder pro blocks");
    };

    let proBlocksArray = proBlocks.toArray();
    let reorderedProBlocks = proBlocksArray.map(
      func(block) {
        let index = newOrder.findIndex(func(id) { id == block.id });
        switch (index) {
          case (null) { block };
          case (?newPos) { { block with position = newPos } };
        };
      }
    );

    proBlocks.clear();
    proBlocks.addAll(reorderedProBlocks.values());
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Episodes Management (with production progress)
  public shared ({ caller }) func createEpisode(
    title : Text,
    description : Text,
    videoUrl : Text,
    thumbnailUrl : Text,
    explicitReleaseDate : Int,
    runtime : ?Nat,
    visibility : Visibility,
    taggedCharacterIds : [Nat],
    writingComplete : Bool,
    storyboardComplete : Bool,
    voiceActingComplete : Bool,
    animationComplete : Bool,
    editingComplete : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create episodes");
    };

    let order = episodes.size();

    let newEpisode : Episode = {
      id = nextEpisodeId;
      title;
      description;
      videoUrl;
      thumbnailUrl;
      explicitReleaseDate;
      runtime;
      visibility;
      taggedCharacterIds;
      order;
      writingComplete;
      storyboardComplete;
      voiceActingComplete;
      animationComplete;
      editingComplete;
      released = visibility == #publicVisibility;
    };

    episodes.add(newEpisode);
    nextEpisodeId += 1;
  };

  public shared ({ caller }) func updateEpisode(
    id : Nat,
    title : Text,
    description : Text,
    videoUrl : Text,
    thumbnailUrl : Text,
    explicitReleaseDate : Int,
    runtime : ?Nat,
    visibility : Visibility,
    taggedCharacterIds : [Nat],
    writingComplete : Bool,
    storyboardComplete : Bool,
    voiceActingComplete : Bool,
    animationComplete : Bool,
    editingComplete : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update episodes");
    };

    episodes.mapInPlace(
      func(ep) {
        if (ep.id == id) {
          {
            id;
            title;
            description;
            videoUrl;
            thumbnailUrl;
            explicitReleaseDate;
            runtime;
            visibility;
            taggedCharacterIds;
            order = ep.order;
            writingComplete;
            storyboardComplete;
            voiceActingComplete;
            animationComplete;
            editingComplete;
            released = visibility == #publicVisibility;
          };
        } else {
          ep;
        };
      }
    );
  };

  public shared ({ caller }) func deleteEpisode(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete episodes");
    };

    let filtered = episodes.filter(func(ep) { ep.id != id });
    episodes.clear();
    episodes.addAll(filtered.values());
  };

  public query ({ caller }) func getAllEpisodes() : async [Episode] {
    episodes.toArray();
  };

  public query ({ caller }) func getEpisodeById(id : Nat) : async ?Episode {
    episodes.find(func(ep) { ep.id == id });
  };

  public shared ({ caller }) func reorderEpisodes(newOrder : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reorder episodes");
    };

    let episodesArray = episodes.toArray();
    let reorderedEpisodes = episodesArray.map(
      func(ep) {
        let index = newOrder.findIndex(func(id) { id == ep.id });
        switch (index) {
          case (null) { ep };
          case (?newPos) { { ep with order = newPos } };
        };
      }
    );

    episodes.clear();
    episodes.addAll(reorderedEpisodes.values());
  };

  // Characters Management
  public shared ({ caller }) func createCharacter(name : Text, bio : Text, role : Text, clanId : ?Nat, episodes : [Nat], portraitUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create characters");
    };

    let newCharacter = {
      id = nextCharacterId;
      name;
      bio;
      role;
      clanId;
      episodes;
      portraitUrl;
    };

    characters.add(newCharacter);
    nextCharacterId += 1;
  };

  public shared ({ caller }) func updateCharacter(id : Nat, name : Text, bio : Text, role : Text, clanId : ?Nat, episodes : [Nat], portraitUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update characters");
    };

    characters.mapInPlace(
      func(ch) {
        if (ch.id == id) {
          {
            id;
            name;
            bio;
            role;
            clanId;
            episodes;
            portraitUrl;
          };
        } else {
          ch;
        };
      }
    );
  };

  public shared ({ caller }) func deleteCharacter(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete characters");
    };

    let filtered = characters.filter(func(ch) { ch.id != id });
    characters.clear();
    characters.addAll(filtered.values());
  };

  public query ({ caller }) func getAllCharacters() : async [Character] {
    characters.toArray();
  };

  public query ({ caller }) func getCharacterById(id : Nat) : async ?Character {
    characters.find(func(ch) { ch.id == id });
  };

  // Clans Management
  public shared ({ caller }) func createClan(name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create clans");
    };

    let newClan = {
      id = nextClanId;
      name;
      description;
      members = [];
    };

    clans.add(newClan);
    nextClanId += 1;
  };

  public shared ({ caller }) func updateClan(id : Nat, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update clans");
    };

    clans.mapInPlace(
      func(cl) {
        if (cl.id == id) {
          {
            id;
            name;
            description;
            members = cl.members;
          };
        } else {
          cl;
        };
      }
    );
  };

  public shared ({ caller }) func addMemberToClan(clanId : Nat, characterId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add clan members");
    };

    clans.mapInPlace(
      func(cl) {
        if (cl.id == clanId) {
          {
            cl with members = cl.members.concat([characterId]);
          };
        } else {
          cl;
        };
      }
    );
  };

  public shared ({ caller }) func removeMemberFromClan(clanId : Nat, characterId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove clan members");
    };

    clans.mapInPlace(
      func(cl) {
        if (cl.id == clanId) {
          {
            cl with members = cl.members.filter(func(member) { member != characterId });
          };
        } else {
          cl;
        };
      }
    );
  };

  public shared ({ caller }) func deleteClan(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete clans");
    };

    let filtered = clans.filter(func(cl) { cl.id != id });
    clans.clear();
    clans.addAll(filtered.values());
  };

  public query ({ caller }) func getAllClans() : async [Clan] {
    clans.toArray();
  };

  public query ({ caller }) func getClanById(id : Nat) : async ?Clan {
    clans.find(func(cl) { cl.id == id });
  };

  // Gallery Items Management
  public shared ({ caller }) func createGalleryItem(title : Text, imageUrl : Text, description : Text, creator : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create gallery items");
    };

    let newItem = {
      id = nextGalleryItemId;
      title;
      imageUrl;
      description;
      creator;
      date = Time.now();
    };

    galleryItems.add(newItem);
    nextGalleryItemId += 1;
  };

  public shared ({ caller }) func updateGalleryItem(id : Nat, title : Text, imageUrl : Text, description : Text, creator : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update gallery items");
    };

    galleryItems.mapInPlace(
      func(item) {
        if (item.id == id) {
          {
            id;
            title;
            imageUrl;
            description;
            creator;
            date = item.date;
          };
        } else {
          item;
        };
      }
    );
  };

  public shared ({ caller }) func deleteGalleryItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };

    let filtered = galleryItems.filter(func(item) { item.id != id });
    galleryItems.clear();
    galleryItems.addAll(filtered.values());
  };

  public query ({ caller }) func getAllGalleryItems() : async [GalleryItem] {
    galleryItems.toArray();
  };

  public query ({ caller }) func getGalleryItemById(id : Nat) : async ?GalleryItem {
    galleryItems.find(func(item) { item.id == id });
  };

  public query ({ caller }) func getGalleryImages() : async [BlobStorage.ExternalBlob] {
    galleryImages.toArray();
  };

  // News Management
  public shared ({ caller }) func createNewsPost(title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create news posts");
    };

    let newPost = {
      id = nextNewsPostId;
      author = "Creator";
      title;
      content;
      timestamp = Time.now();
    };

    newsPosts.add(newPost);
    nextNewsPostId += 1;
  };

  public shared ({ caller }) func updateNewsPost(id : Nat, title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update news posts");
    };

    newsPosts.mapInPlace(
      func(post) {
        if (post.id == id) {
          {
            post with
            title;
            content;
            timestamp = Time.now();
          };
        } else {
          post;
        };
      }
    );
  };

  public shared ({ caller }) func deleteNewsPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete news posts");
    };

    let filtered = newsPosts.filter(func(post) { post.id != id });
    newsPosts.clear();
    newsPosts.addAll(filtered.values());
  };

  public query ({ caller }) func getAllNewsPosts() : async [NewsPost] {
    newsPosts.toArray();
  };

  public query ({ caller }) func getNewsPostsByAuthor(author : Text) : async [NewsPost] {
    newsPosts.filter(func(post) { Text.equal(post.author, author) }).toArray();
  };

  public query ({ caller }) func getNewsPostById(id : Nat) : async ?NewsPost {
    newsPosts.find(func(post) { post.id == id });
  };

  // Scripts Management (New)
  public shared ({ caller }) func createScript(title : Text, content : Text, creator : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create scripts");
    };

    let newScript = {
      id = nextScriptId;
      title;
      content;
      creator;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    scripts.add(newScript);
    nextScriptId += 1;
  };

  public shared ({ caller }) func updateScript(id : Nat, title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update scripts");
    };

    scripts.mapInPlace(
      func(script) {
        if (script.id == id) {
          {
            script with
            title;
            content;
            updatedAt = Time.now();
          };
        } else {
          script;
        };
      }
    );
  };

  public shared ({ caller }) func deleteScript(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete scripts");
    };

    let filtered = scripts.filter(func(script) { script.id != id });
    scripts.clear();
    scripts.addAll(filtered.values());
  };

  public query ({ caller }) func getAllScripts() : async [Script] {
    scripts.toArray();
  };

  public query ({ caller }) func getScriptById(id : Nat) : async ?Script {
    scripts.find(func(script) { script.id == id });
  };

  // Team Member Management (New)
  public query ({ caller }) func listTeamMembers() : async [(Principal, AccessControl.UserRole)] {
    [];
  };

  public shared ({ caller }) func grantRole(principal : Principal, role : AccessControl.UserRole) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the creator can grant roles");
    };

    AccessControl.assignRole(accessControlState, caller, principal, role);
  };

  public shared ({ caller }) func revokeRole(principal : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the creator can revoke roles");
    };

    AccessControl.assignRole(accessControlState, caller, principal, #guest);
  };
};
