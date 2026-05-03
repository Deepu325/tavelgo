# Research: Architecture Patterns

Modern architectural patterns for a Cab Booking Web App using Next.js and Supabase.

## High-Level Architecture

### Frontend (Next.js)
- **App Router**: Using Server Components for data fetching and Client Components for interactivity.
- **Server Actions**: Handling form submissions (bookings, login) and database mutations.
- **Zustand Store**: Managing global UI state (current ride, user location, auth status).

### Backend (Supabase)
- **PostgreSQL**: Relational database for Users, Drivers, Vehicles, and Bookings.
- **Row-Level Security (RLS)**: Enforcing data isolation at the database level.
- **Edge Functions**: (Optional) For complex logic like fare calculations or external API integrations.
- **Realtime**: Using Supabase Realtime to push booking updates to drivers and customers without polling.

## Data Flow: Booking Lifecycle

1. **Request**: Customer inputs locations → Next.js calculates distance (Server Action) → Returns estimate.
2. **Creation**: Customer selects vehicle → Server Action creates Booking record in Supabase.
3. **Dispatch**: Supabase Realtime notifies available Drivers matching the vehicle type.
4. **Acceptance**: Driver accepts → Supabase update triggers RLS-filtered Realtime event to Customer.
5. **Updates**: Status changes (In Progress, Completed) pushed via Realtime to both parties.

## Database Schema Best Practices
- **UUIDs**: Use `gen_random_uuid()` for all primary keys.
- **Enums**: Use Postgres enums for `ride_status` (Pending, Accepted, InProgress, Completed, Cancelled).
- **Foreign Keys**: Strict relationships between `bookings`, `drivers`, and `users`.

## Security Model (Supabase RLS)
- **Customers**: Can read/write only their own bookings.
- **Drivers**: Can read "Pending" bookings of their vehicle type and their own "Accepted" bookings.
- **Admins**: Full access to pricing and user management.

---
*Last updated: 2026-05-03*
