import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type OldGalleryItem = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    description : Text;
    creator : Text;
    date : Int;
  };

  type OldActor = {
    galleryItems : List.List<OldGalleryItem>;
    nextGalleryItemId : Nat;
  };

  type NewGalleryItem = {
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

  type NewActor = {
    galleryItems : List.List<NewGalleryItem>;
    nextGalleryItemId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newGalleryItems = old.galleryItems.map<OldGalleryItem, NewGalleryItem>(
      func(oldItem) {
        {
          id = oldItem.id;
          title = oldItem.title;
          artistName = "Unknown";
          artworkTitle = oldItem.title;
          description = ?oldItem.description;
          creditLink = null;
          imageUrl = oldItem.imageUrl;
          creator = oldItem.creator;
          date = oldItem.date;
          featured = false;
          taggedCharacterIds = [];
          taggedClanIds = [];
          popularity = 0;
          viewCount = 0;
        };
      }
    );

    { galleryItems = newGalleryItems; nextGalleryItemId = old.nextGalleryItemId };
  };
};
