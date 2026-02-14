# Specification

## Summary
**Goal:** Expand the Whispers Of The White Moon website with a clan personality quiz, a power system reference database, and discoverable hidden lore/artwork content.

**Planned changes:**
- Add an interactive “Clan Personality Quiz” (8–12 multiple-choice questions) that secretly scores answers toward clans and ends with a results screen.
- Implement quiz results for Moon, Fire, Water, Sun, Earth, Wind, Lightning, plus a rare/secret Balance Clan outcome, each showing the provided personality description text and a styled results card suitable for screenshotting/sharing.
- Add a “Power System Database” page/section with headings for power types, rules/limits, forbidden techniques, and browsable character ability lists.
- Add hidden unlockable content features (secret page(s), hidden character info, lore fragments with found/missing tracking, and unlock-gated bonus artwork).
- Integrate navigation entry points to the Quiz and Power System Database without breaking existing hash-based handling for #admin and #pro.
- Add generated static bonus artwork assets under `frontend/public/assets/generated` and surface them within the unlockable content experience(s).

**User-visible outcome:** Users can take a clan quiz and receive a shareable results card, browse a power system database of abilities and character powers, and discover hidden pages/lore/artwork through exploration—while existing #admin and #pro access continues to work.
