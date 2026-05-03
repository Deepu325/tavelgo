# Phase 2: Booking Engine - Context

**Gathered:** 2026-05-03
**Status:** Ready for planning
**Source:** PRD/TRD/DRD Express Path

<domain>
## Phase Boundary

This phase implements the core booking logic, including vehicle type definitions, fare calculation, and the booking creation flow for customers.

</domain>

<decisions>
## Implementation Decisions

### Booking Flow (Locked)
- **Selection**: User chooses from available vehicle types (Hatchback, Sedan, SUV).
- **Pricing**: Fares are calculated server-side based on distance and vehicle type rates.
- **Packages**: Support for "Local Packages" (e.g., 4hrs/40km) as per TRD.
- **State**: Bookings start in `pending` status.

### Data Model (Locked)
- **Vehicles Table**: Stores rates per vehicle type.
- **Bookings Table**: Stores pickup/drop coordinates, distance, fare, and status.

### Security (Locked)
- RLS for `bookings`: Customers can view only their own bookings.
- Fare calculation MUST happen in a Server Action to prevent client-side manipulation.

</decisions>

<canonical_refs>
## Canonical References

### Project Specifications
- `PROJECT.md`
- `PRD.md` — Requirement BOOK-01 to BOOK-04.
- `TRD.md` — Schema for `vehicles` and `bookings`.

### Research
- `.planning/research/FEATURES.md` — Booking logic details.
- `.planning/research/PITFALLS.md` — Fare manipulation risks.

</canonical_refs>

<specifics>
## Specific Ideas
- Use Google Maps API (or a mock service) for distance calculation if needed, but PRD says "Distance-based fare".
- Implement a `calculateFare` utility on the server.
- Create a `BookingForm` component with ShadCN `Select` and `Input`.

</specifics>

---

*Phase: 02-booking-engine*
*Context gathered: 2026-05-03 via PRD Express Path*
