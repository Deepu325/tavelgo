# Requirements: Cab Booking Web App

**Defined:** 2026-05-03
**Core Value:** Fast booking + transparent pricing + simple driver interaction

## v1 Requirements

Requirements for the MVP release. Each maps to roadmap phases.

### Authentication & Authorization

- [ ] **AUTH-01**: User can sign up/login with email and password (via Supabase)
- [ ] **AUTH-02**: User session persists across browser refresh
- [ ] **AUTH-03**: Role-based access control (Customer, Driver, Admin roles)
- [ ] **AUTH-04**: Row-Level Security (RLS) ensures users only access their own data

### Booking Engine

- [ ] **BOOK-01**: User can input pickup and drop locations
- [ ] **BOOK-02**: System calculates distance and estimated fare based on vehicle type
- [ ] **BOOK-03**: User can select from available vehicle types (5-Seater, Innova Crysta, Tempo Traveller)
- [ ] **BOOK-04**: User can create a booking request
- [ ] **BOOK-05**: Drivers matching the vehicle type receive real-time booking requests
- [ ] **BOOK-06**: Driver can accept or reject a booking request
- [ ] **BOOK-07**: Atomic booking acceptance (only the first driver to accept succeeds)

### Ride Management

- [ ] **RIDE-01**: Real-time status updates (Pending, Accepted, In Progress, Completed, Cancelled)
- [ ] **RIDE-02**: Driver can start and complete a ride
- [ ] **RIDE-03**: Customer and Driver see current ride status and details
- [ ] **RIDE-04**: Driver availability toggle (Online/Offline)

### User History & Admin

- [ ] **HIST-01**: Users can view their past booking history
- [ ] **HIST-02**: Admin can manage base fares and per-km rates for different vehicle types
- [ ] **HIST-03**: Profile view with basic user information

## v2 Requirements

### Advanced Features

- **NOTF-01**: In-app and push notifications for status changes
- **MAPS-01**: Google Maps integration for real-time tracking and navigation
- **REVW-01**: Rating and review system for customers and drivers
- **PAYM-01**: Integrated payment gateway (Stripe/Razorpay)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-modal transport | Outside the scope of a cab-focused booking app |
| Real-time GPS tracking | Complexity deferred to v2 to focus on core booking logic |
| Native Mobile App | Web-first approach for MVP |
| Wallet System | Use external payments or cash-on-completion for MVP |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| BOOK-01 | Phase 2 | Pending |
| BOOK-02 | Phase 2 | Pending |
| BOOK-03 | Phase 2 | Pending |
| BOOK-04 | Phase 2 | Pending |
| BOOK-05 | Phase 3 | Pending |
| BOOK-06 | Phase 3 | Pending |
| BOOK-07 | Phase 3 | Pending |
| RIDE-01 | Phase 3 | Pending |
| RIDE-02 | Phase 3 | Pending |
| RIDE-03 | Phase 3 | Pending |
| RIDE-04 | Phase 4 | Pending |
| HIST-01 | Phase 4 | Pending |
| HIST-02 | Phase 4 | Pending |
| HIST-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-03*
*Last updated: 2026-05-03 after initial definition*
