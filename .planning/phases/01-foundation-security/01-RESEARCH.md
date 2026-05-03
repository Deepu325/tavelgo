# Phase 1 Research: Foundation & Security

Research into the 2026 best practices for Next.js 16 and Supabase integration, focusing on role-based access control (RBAC) and security.

## Core Implementation Patterns

### 1. Next.js 16 + Supabase SSR
- Use the `@supabase/ssr` package for cookie-based authentication.
- Create a `middleware.ts` to protect routes and refresh sessions.
- Use `createClient` within Server Components and Server Actions to ensure the user context is propagated correctly.

### 2. Role-Based Access Control (RBAC)
- **Database-Level (RLS)**: This is the primary security layer.
- **Pattern**: Create a `profiles` table that maps `auth.users` IDs to roles (`customer`, `driver`, `admin`).
- **RLS Policy**: Use subqueries in SQL to check the user's role from the `profiles` table.
- **Example Policy**:
  ```sql
  CREATE POLICY "Drivers can view their own data"
  ON public.drivers
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'driver'
    )
  );
  ```

### 3. Server Actions Security
- **Explicit Auth Check**: Instantiate the Supabase client and call `getUser()` inside the action.
- **Argument Validation**: Use `zod` to validate all input data.
- **Error Handling**: Use `useActionState` (formerly `useFormState`) in the UI to handle and display errors returned from Server Actions.

### 4. Database Setup
- Use migrations (`supabase db push`) instead of the Dashboard for schema changes to ensure version control.
- Enforce UUIDs for all IDs.
- Use Postgres Enums for fixed sets like `user_role`.

## Dependencies & Versions
- `next`: `^16.2.0`
- `@supabase/supabase-js`: `latest`
- `@supabase/ssr`: `latest`
- `zod`: `^3.x`
- `lucide-react`: `^1.14.x`
- `shadcn-ui` (via registry)

## Pitfalls to Avoid
- **Race Conditions**: During driver acceptance, use database-level atomic updates.
- **Exposing Service Role Key**: Never use the `service_role` key in the frontend or client-side code.
- **Insecure Server Actions**: Ensure every Action has an auth check, even if RLS is enabled.
- **Stale Sessions**: Properly implement middleware to refresh cookies on every request.

## Validation Architecture
- **Unit Tests**: Test role-checking logic.
- **Integration Tests**: Verify that RLS correctly blocks unauthorized access to tables.
- **E2E Tests**: Walk through the login flow for each role (Customer, Driver, Admin).

---
*Phase: 01-foundation-security*
*Last updated: 2026-05-03*
