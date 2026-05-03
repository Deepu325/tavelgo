# Roadmap: Cab Booking Web App

## Overview
This roadmap takes the project from a fresh Next.js + Supabase setup to a functional MVP for cab booking. We start with a secure foundation (Auth + RLS), move into the core booking engine (Distance/Fare/Selection), implement the real-time ride lifecycle (Dispatch/Accept/Complete), and finish with user history and administrative controls.

## Phases

- [ ] **Phase 1: Foundation & Security** - Setup project, authentication, and role-based access control.
- [ ] **Phase 2: Booking Engine** - Implement location input, distance calculation, and fare estimation.
- [ ] **Phase 3: Ride Lifecycle** - Real-time ride dispatching, atomic driver acceptance, and status tracking.
- [ ] **Phase 4: User History & Admin** - Booking history views, driver availability, and admin pricing management.

## Phase Details

### Phase 1: Foundation & Security
**Goal**: Establish a secure, role-based foundation for the application.
**Depends on**: Nothing
**Requirements**: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, HIST-03]
**Success Criteria**:
  1. User can sign up and log in as a Customer or Driver.
  2. Authenticated sessions persist across page refreshes.
  3. Database tables are protected by RLS (users can only see their own data).
  4. User can view their own profile details.
**Plans**: 2 plans

Plans:
- [x] 01-01: Project initialization and Supabase Auth setup.
- [ ] 01-02: Database schema design and Row-Level Security (RLS) implementation.

### Phase 2: Booking Engine
**Goal**: Enable users to estimate fares and select vehicles.
**Depends on**: Phase 1
**Requirements**: [BOOK-01, BOOK-02, BOOK-03, BOOK-04]
**Success Criteria**:
  1. User can enter pickup and drop locations.
  2. System provides a distance-based fare estimate for different vehicle tiers.
  3. User can select a specific vehicle type and initiate a booking request.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Location input UI and distance/fare calculation logic.
- [ ] 02-02: Vehicle selection interface and booking creation workflow.

### Phase 3: Ride Lifecycle
**Goal**: Manage the real-time interaction between customers and drivers.
**Depends on**: Phase 2
**Requirements**: [BOOK-05, BOOK-06, BOOK-07, RIDE-01, RIDE-02, RIDE-03]
**Success Criteria**:
  1. Drivers receive real-time notifications for pending bookings.
  2. Only the first driver to accept a booking succeeds (atomic acceptance).
  3. Both parties see real-time updates as the ride progresses (Accepted -> In Progress -> Completed).
**Plans**: 2 plans

Plans:
- [ ] 03-01: Real-time dispatching and atomic driver acceptance logic.
- [ ] 03-02: Ride status management and real-time UI updates for both roles.

### Phase 4: User History & Admin
**Goal**: Provide transparency through history and control through admin tools.
**Depends on**: Phase 3
**Requirements**: [RIDE-04, HIST-01, HIST-02]
**Success Criteria**:
  1. User can view a chronological history of their past bookings.
  2. Drivers can toggle their availability status (Online/Offline).
  3. Admin can update base fares and rates per km for each vehicle type.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Booking history views and driver availability toggle.
- [ ] 04-02: Admin dashboard for pricing and vehicle configuration.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Security | 0/2 | Not started | - |
| 2. Booking Engine | 0/2 | Not started | - |
| 3. Ride Lifecycle | 0/2 | Not started | - |
| 4. User History & Admin | 0/2 | Not started | - |

---
*Roadmap defined: 2026-05-03*
*Last updated: 2026-05-03 after initial definition*
