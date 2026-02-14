# Specification

## Summary
**Goal:** Let any visitor submit Collaboration and Supporter Help inquiries from the Contact page, and allow admins to view those submissions in the admin panel.

**Planned changes:**
- Update the Contact page to replace the static “Collaboration” and “Supporter Help” cards with interactive submission forms (Name, Email, Optional Social Media Links, Message) including validation and success/error alerts.
- Keep the existing “ONLY for supporters…” warning visible above the Supporter Help form.
- Add backend storage and actor methods for creating Collaboration and Supporter Help submissions (public) and listing them (admin-only).
- Add React Query hooks for submitting and admin-fetching Collaboration and Supporter Help submissions.
- Add new admin dashboard tabs/panels to list Collaboration and Supporter Help submissions, with item detail dialogs and loading/error states similar to existing Fan Mail admin UI.

**User-visible outcome:** Visitors can submit Collaboration or Supporter Help messages directly on the Contact page without logging in, and admins can view all submissions in the admin dashboard.
