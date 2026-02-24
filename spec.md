# Specification

## Summary
**Goal:** Remove account setup functionality while preserving Internet Identity authentication.

**Planned changes:**
- Remove SignupModal component from frontend
- Remove signup storage utilities (signupStorage.ts)
- Remove password hashing utilities (passwordHash.ts)
- Remove UserProfile type and user registration/authentication methods from backend (main.mo)
- Remove UserProfile and authentication types from migration module (migration.mo)

**User-visible outcome:** Users will no longer see or be able to access account setup functionality. Internet Identity authentication and admin access remain functional.
