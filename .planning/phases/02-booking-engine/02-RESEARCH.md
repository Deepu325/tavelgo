# Phase 2 Research: Booking Engine

Research into secure fare calculation, distance estimation, and vehicle schema management for Next.js 16 and Supabase.

## Core Implementation Patterns

### 1. Server-Side Fare Calculation
- **Pattern**: Use a Next.js Server Action (`calculateFareAction`) to process booking requests.
- **Security**: Never trust the fare sent from the client. The server must re-calculate the fare based on distance and vehicle rates stored in the database.
- **Workflow**: 
  1. Client sends origin/destination.
  2. Server fetches vehicle rates from `vehicles` table.
  3. Server calculates distance (via API or mock).
  4. Server computes total fare: `base_fare + (distance * rate_per_km)`.
  5. Server returns the estimate and a "quote ID" (optional) or proceeds to booking creation.

### 2. Distance Estimation (Google Maps Distance Matrix)
- **Security**: Hide API keys in `process.env.GOOGLE_MAPS_API_KEY` (no `NEXT_PUBLIC_`).
- **Optimization**:
  - **Haversine Fallback**: Use a simple coordinate-based distance calculation for rough estimates to reduce API calls.
  - **Caching**: Store distance results for common routes in a `route_cache` table to save costs.
- **Mocking for MVP**: For the initial MVP development, use a mock distance service that returns a random distance between 5-20km to unblock UI development without requiring a GCP account immediately.

### 3. Vehicle Schema & Rates
- **Table**: `public.vehicles`
  - `id`: uuid
  - `type`: text (Hatchback, Sedan, SUV)
  - `base_fare`: numeric
  - `rate_per_km`: numeric
  - `is_active`: boolean
- **Initialization**: Seed the database with default rates for each type.

### 4. Booking State Machine
- **Statuses**: `pending` (searching for driver) -> `accepted` (driver found) -> `in_progress` (started) -> `completed` (finished) -> `cancelled`.
- **Atomic Creation**: Use a Supabase RPC or transaction if complex logic is needed, but for MVP, a standard insert with RLS is sufficient.

## Dependencies & Versions
- `google-maps-services-js`: `latest` (for Node.js environment)
- `lucide-react`: `^1.14.x` (for vehicle icons)

## Pitfalls to Avoid
- **Client-Side Pricing**: Avoid calculating the total price in JavaScript on the frontend.
- **API Rate Limits**: Implement exponential backoff if using external APIs.
- **Precision Errors**: Use `numeric` or `decimal` in Postgres, not `float`, to avoid penny rounding issues.

## Validation Architecture
- **Fare Accuracy**: Unit test the `calculateFare` utility with various distances and vehicle types.
- **Security Check**: Verify that a user cannot create a booking with a self-defined fare (RLS or Server Action validation).
- **UI Responsiveness**: Ensure the "Finding Driver" state is handled gracefully with loading indicators.

---
*Phase: 02-booking-engine*
*Last updated: 2026-05-03*
