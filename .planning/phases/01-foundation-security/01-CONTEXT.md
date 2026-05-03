# Phase 1: Foundation & Security — Context

**Gathered:** 2026-05-03
**Status:** Ready for planning
**Source:** PRD/TRD Express Path (MERN Stack)

<domain>
## Phase Boundary

Establish the secure MERN foundation for the Cab Booking app. This includes:
- Backend: Express server, MongoDB connection, Mongoose user model, JWT auth middleware
- Frontend: React (Vite) shell, routing, login/register pages, Tailwind + base UI

</domain>

<decisions>
## Implementation Decisions

### Stack (Locked)
- **Backend**: Node.js + Express
- **Database**: MongoDB via Mongoose
- **Auth**: Custom JWT (access token in header, HttpOnly cookie for refresh token)
- **Frontend**: React (Vite) + Tailwind CSS + Lucide icons
- **State**: Zustand (auth store)

### Auth Architecture (Locked)
- Registration: `POST /api/auth/register` — name, email, password, role
- Login: `POST /api/auth/login` — email, password → returns JWT access token
- Password hashing: bcrypt (salt rounds = 10)
- Token: JWT signed with `process.env.JWT_SECRET`, expiry 1 day
- Roles: `customer`, `driver`, `admin`
- Middleware: `authMiddleware.js` verifies Bearer token on protected routes
- Role guard: `roleMiddleware.js` checks `req.user.role`

### Backend Structure (Locked)
```
backend/
  models/User.js
  routes/auth.js
  middleware/auth.js
  middleware/roleCheck.js
  controllers/authController.js
  server.js
  .env
```

### Frontend Structure (Locked)
```
frontend/src/
  pages/LoginPage.tsx
  pages/RegisterPage.tsx
  pages/CustomerDashboard.tsx
  pages/DriverDashboard.tsx
  store/authStore.ts  (Zustand)
  services/api.ts     (Axios instance)
  App.tsx             (React Router)
```

### Security (Locked)
- Helmet for HTTP headers
- CORS restricted to `http://localhost:5173` (dev)
- express-rate-limit on auth routes
- Never expose passwords or stack traces in responses

</decisions>

<canonical_refs>
## Canonical References

- `PRD.md` — Feature priorities and auth requirements
- `TRD.md` — MERN schema definitions and fare logic spec
- `DRD.md` — UI visual guidelines

</canonical_refs>

---
*Phase: 01-foundation-security*
*Context gathered: 2026-05-03 via PRD Express Path*
