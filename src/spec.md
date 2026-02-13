# Specification

## Summary
**Goal:** Let admins add an optional character portrait image (validated to 20MB max, PNG/JPEG/WebP) when creating or editing characters, and display it on public character cards when available.

**Planned changes:**
- Persist an optional character portrait reference (e.g., `portraitUrl`) in the backend Character model and return it from character query APIs.
- Extend backend create/update Character mutations to accept and store the optional portrait reference while keeping existing admin-only authorization behavior.
- Add/adjust upgrade migration logic if the stable state schema changes so existing stored characters are preserved and the portrait field initializes safely.
- Update frontend React Query hooks/types to read/write the portrait field in create/update flows.
- Enhance the Characters admin panel to include a portrait file picker with client-side validation (20MB max; PNG/JPEG/WebP), preview, and ability to clear the portrait before saving.
- Update public Characters section/card rendering to show the portrait image when present, otherwise keep the existing placeholder icon behavior.

**User-visible outcome:** Admins can upload/select and save a character portrait image (up to 20MB) in the Characters admin panel, and users will see that portrait on character cards when it’s set.
