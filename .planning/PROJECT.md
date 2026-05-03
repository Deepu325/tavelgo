# Project Context: Cab Booking Web App

A streamlined cab booking platform facilitating fast booking, transparent pricing, and simple driver interaction.

## Core Value
Fast booking + transparent pricing + simple driver interaction.

## What This Is
A web application built with Next.js and Supabase for customers to book cabs and drivers to manage ride requests.

## What This Is NOT
- A full-scale Uber/Lyft clone with real-time GPS tracking (MVP focus).
- A payment gateway integration (pricing logic included, but payments are out of scope for MVP).

## Target Users
- **Daily commuters**: People needing reliable rides to work/home.
- **Local travelers**: Users exploring the city.
- **Groups**: Users requiring larger vehicles (Innova, Tempo Traveller).

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] User authentication (JWT-based via Supabase)
- [ ] Role-based access (Customer, Driver, Admin)
- [ ] Fare calculation logic (BaseFare + Distance × Rate)
- [ ] Cab selection (5-Seater, Innova Crysta, Tempo Traveller)
- [ ] Booking creation and management
- [ ] Driver accept/reject workflow
- [ ] Ride status updates
- [ ] Booking history
- [ ] Admin pricing control (Medium Priority)
- [ ] Driver availability toggle (Medium Priority)

### Out of Scope
- Ratings and reviews (Low Priority)
- In-app notifications (Low Priority)
- Real-time GPS tracking (Low Priority)
- Payment gateway integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + Supabase | Chosen over MERN for faster development and cleaner architecture for this scope. | Approved |
| Tailwind CSS + ShadCN UI | Industry standard for rapid, consistent, and beautiful UI development. | Approved |
| Role-Based RLS | Crucial for security in Supabase to ensure users only access their own data. | Approved |
| Server-side Fare Logic | Ensures pricing consistency and prevents client-side manipulation. | Approved |

## Evolution
This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-03 after initialization*
