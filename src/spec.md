# Specification

## Summary
**Goal:** Let visitors watch episodes that are marked as Released via an on-page video player, and show clear messaging when an episode is not released or has no video URL.

**Planned changes:**
- Update the public Episodes section UI to add a clear “Watch” (or equivalent) affordance for each episode.
- When “Watch” is activated: if the episode status is “Released”, open an on-page player experience (e.g., modal/dialog or expandable panel) that plays the episode using the stored videoUrl.
- If the episode status is not “Released”, do not open the player; instead show a clear English message that the episode has not been released yet.
- Extend the Episodes section’s episode view model to preserve playback fields from backend data (at minimum videoUrl) and pass them through without breaking existing EpisodeCard rendering.
- Handle missing videoUrl for “Released” episodes by showing a clear English “video not available yet” message instead of rendering a broken player.
- Ensure the new player UI matches the existing cinematic dark styling and remains usable on mobile and desktop.

**User-visible outcome:** In the Episodes section, visitors can click “Watch” to play released episodes in an on-page player; unreleased episodes (or released episodes without a video URL) show clear English messaging instead of a player.
