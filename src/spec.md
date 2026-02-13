# Specification

## Summary
**Goal:** Enhance the Episodes admin panel to support richer episode metadata, thumbnail uploads, and persistent drag-and-drop ordering.

**Planned changes:**
- Extend the backend Episode model and CRUD APIs to store admin-managed fields: runtime (minutes), visibility (Draft/Scheduled/Public), admin-set release date, tagged character IDs, and a persisted sort/order value.
- Add conditional state migration (only if needed) to preserve existing episodes and initialize new fields with deterministic defaults.
- Update frontend query hooks and types so create/update/read operations include the new episode fields and continue to invalidate/refetch the episodes list after mutations (including reordering).
- Enhance the Episodes admin create/edit UI to add: thumbnail file upload with preview (stored in thumbnailUrl), release date selector, runtime input, visibility selector, and character tagging multi-select sourced from the characters list; keep the existing summary as a large textarea with clear English validation errors.
- Implement (or verify existing) drag-and-drop reordering in the Episodes admin list and persist the order via the backend sort/order field.

**User-visible outcome:** Admins can upload episode thumbnails, set release dates and runtime, control visibility (Draft/Scheduled/Public), tag appearing characters, edit episode summaries, and reorder episodes via drag-and-drop with the order preserved after refresh.
