# Phase 1 Validation Strategy: Foundation & Security

**Defined:** 2026-05-03
**Status:** Ready for execution

## Validation Architecture

### 1. Security & Authorization (Critical)
- **RLS Verification**: Every table created in this phase MUST have RLS enabled.
- **Role Isolation**: Verify that a user with the `customer` role cannot read or write to `drivers` or `vehicles` tables.
- **Middleware Check**: Ensure unauthenticated users are redirected to `/login` for protected routes.

### 2. Functional Verification
- **Auth Flow**: Success path for Signup, Login, and Logout.
- **Profile Persistence**: Verify that user role and metadata are correctly stored in the `profiles` table upon signup.

### 3. Technical Verification
- **Build Pass**: `npm run build` must succeed without type errors.
- **Server Action Security**: Verify that Server Actions explicitly check for an active user session.

## Must-Have Deliverables (Gated)

- [ ] `profiles` table with `role` enum and RLS policies.
- [ ] Working Signup/Login UI using `@supabase/ssr`.
- [ ] Middleware-protected routes for `/dashboard` and `/driver`.
- [ ] `useAuth` hook for client-side session management.

---
*Phase: 01-foundation-security*
*Last updated: 2026-05-03*
