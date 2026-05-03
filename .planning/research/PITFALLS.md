# Research: Common Pitfalls

Identified risks and common failure points when building Cab Booking applications.

## Technical Pitfalls

### 1. Race Conditions in Booking Acceptance
- **The Issue**: Two drivers accept the same booking simultaneously.
- **The Fix**: Use database-level transactions or atomic updates in Supabase (PostgREST) to ensure only the first `UPDATE` succeeds.

### 2. Fare Calculation Inconsistency
- **The Issue**: Calculating fare on the client side allows for malicious manipulation.
- **The Fix**: Always calculate and verify fares on the server (Server Actions or Supabase Functions).

### 3. Realtime Overload
- **The Issue**: Subscribing to too many tables or large datasets via Realtime can degrade performance.
- **The Fix**: Use granular filters in Supabase Realtime subscriptions (e.g., only subscribe to a specific booking ID).

## UX/Business Pitfalls

### 4. Vague Error Messaging
- **The Issue**: "Something went wrong" when no drivers are available.
- **The Fix**: Be explicit: "No drivers available in your area for [Vehicle Type]. Try a different vehicle or wait a few minutes."

### 5. Ignoring Offline States
- **The Issue**: App breaks or stays in a loading loop when the user enters a tunnel or loses connectivity.
- **The Fix**: Implement optimistic UI updates and handle offline states with clear messaging.

### 6. Role Confusion
- **The Issue**: A user logged in as a Customer seeing Driver-specific buttons or vice versa.
- **The Fix**: Strict layout-level role checks in Next.js and RLS in Supabase.

## Security Pitfalls

### 7. Leaking Phone Numbers
- **The Issue**: Drivers seeing customer's full profile including private info.
- **The Fix**: Use a "View" or separate public profile table that only reveals necessary info (Name, Pickup Location).

---
*Last updated: 2026-05-03*
