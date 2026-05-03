# Phase 1: Foundation & Security - Context

**Gathered:** 2026-05-03
**Status:** Ready for planning
**Source:** PRD/TRD/DRD Express Path

<domain>
## Phase Boundary

This phase delivers the foundational architecture and security layer for the Cab Booking Web App. This includes project initialization, Supabase integration, authentication setup, and role-based access control (RLS).

</domain>

<decisions>
## Implementation Decisions

### Technical Stack (Locked)
- **Framework**: Next.js (React) with App Router.
- **Backend**: Supabase (PostgreSQL + Auth + Storage).
- **Styling**: Tailwind CSS v4.
- **Components**: ShadCN UI + Lucide Icons.
- **State**: Zustand (for ride/user state).

### Authentication & Authorization (Locked)
- **Method**: JWT-based via Supabase Auth.
- **Roles**: Customer, Driver, Admin.
- **Security**: Row-Level Security (RLS) is mandatory for all tables to ensure data isolation.

### Database Schema (Locked)
- **Users**: id, name, phone, role.
- **Drivers**: id, user_id, vehicle_type, is_available.
- **Vehicles**: type, base_fare, per_km_rate, local_package.
- **Bookings**: id, user_id, driver_id, pickup, drop, distance, fare, status.

### the agent's Discretion
- Project folder structure within `src/`.
- Specific library versions (latest stable as of 2025/2026).
- Initial UI layout and theme configuration (Flat design as per DRD).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `PROJECT.md` — Overall goals and values.
- `PRD.md` — Feature requirements and priorities.
- `TRD.md` — Technical stack and database schema.
- `DRD.md` — Design system and visual style.

### Research
- `.planning/research/STACK.md` — Version recommendations.
- `.planning/research/ARCHITECTURE.md` — Real-time and RLS patterns.
- `.planning/research/PITFALLS.md` — Race conditions and fare logic risks.

</canonical_refs>

<specifics>
## Specific Ideas
- Use ShadCN's `button`, `input`, and `card` components for the initial UI.
- Implement a `useAuth` hook using Supabase client.
- Create a `middleware.ts` for role-based route protection.

</specifics>

<deferred>
## Deferred Ideas
- Real-time GPS tracking (Phase 3/v2).
- Payment gateway integration (v2).
- Ratings and reviews (v2).

</deferred>

---

*Phase: 01-foundation-security*
*Context gathered: 2026-05-03 via PRD Express Path*
