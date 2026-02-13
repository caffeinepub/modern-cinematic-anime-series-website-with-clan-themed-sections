# Specification

## Summary
**Goal:** Add a new Donation section to the public homepage with Cash App support instructions, and expose it via a new “Donation” navigation item.

**Planned changes:**
- Add a new public-facing homepage section with stable id="donation", titled "Donation", using the exact user-provided English donation text (including "$WOTWM"), styled consistently with the site’s cinematic dark theme and existing reveal-on-scroll / reduced-motion-safe animations.
- Update the primary header navigation (desktop and mobile) to include a “Donation” item that smooth-scrolls to #donation without breaking existing scroll targets.
- Insert the Donation section into the main homepage flow in `frontend/src/App.tsx` near the end of the page (e.g., before the Footer) so it appears in both normal view and Pro mode.

**User-visible outcome:** Visitors can click “Donation” in the site navigation to smoothly scroll to a new Donation section that explains how to support “Whispers Of The White Moon” via Cash App ($WOTWM).
