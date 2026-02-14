# Specification

## Summary
**Goal:** Add public fan art submission guidelines, enable admin curation/metadata for gallery items (including featured fan art), and provide public gallery filtering/sorting by character, clan, and popularity.

**Planned changes:**
- Add a public-facing “Submission Guidelines” block to the Gallery section with the provided four English bullet points.
- Extend the backend GalleryItem model and Gallery CRUD APIs to include fan art metadata (artist name, artwork title, optional description, optional credit link), featured flag, optional character/clan tags, and a persisted popularity metric for stable sorting; keep public reads and admin-only writes.
- Update React Query hooks/types to read and write the extended GalleryItem fields while preserving existing gallery query invalidation behavior.
- Enhance the Gallery admin panel so admins can view/edit the new metadata fields and toggle “Featured” on artworks.
- Add a public “Featured Fan Art” section (or clearly separated sub-section) that highlights featured items and opens the existing lightbox on click, with appropriate empty-state behavior.
- Add public gallery controls to filter by character and clan (options sourced from backend Characters/Clans queries when available) and sort by popularity, without breaking existing category/tab behavior.

**User-visible outcome:** Visitors see submission guidelines, can browse featured fan art, and can filter/sort gallery artwork by character, clan, and popularity; admins can manage additional fan art metadata and mark items as featured, with changes reflected without manual refresh.
