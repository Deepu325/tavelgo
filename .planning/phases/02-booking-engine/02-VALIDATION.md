# Phase 2 Validation Strategy: Booking Engine

**Defined:** 2026-05-03
**Status:** Ready for execution

## Validation Architecture

### 1. Functional Verification (Critical)
- **Fare Calculation**: Input `5km` + `Sedan` -> Output must match `base_fare + (5 * rate_per_km)`.
- **Booking Creation**: User clicks "Book" -> Entry appears in `bookings` table with `pending` status.
- **Vehicle Selection**: Verify that all active vehicle types are displayed in the form.

### 2. Security Verification
- **Tamper Proofing**: Attempt to create a booking via direct API call with a manually set fare -> Must fail or be overridden by server-side calculation.
- **RLS Access**: Verify that User A cannot see User B's bookings.

### 3. Technical Verification
- **API Resilience**: Verify mock distance service handles "not found" locations gracefully.
- **State Management**: Ensure `Zustand` correctly stores the pending booking ID for real-time updates (Phase 3).

## Must-Have Deliverables (Gated)

- [ ] `vehicles` table with seeded data.
- [ ] `bookings` table with RLS enabled.
- [ ] `BookingForm` component with vehicle selection and fare preview.
- [ ] `calculateFare` Server Action with server-side validation.

---
*Phase: 02-booking-engine*
*Last updated: 2026-05-03*
