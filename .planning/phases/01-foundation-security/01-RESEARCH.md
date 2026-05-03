# Phase 1 Research: MERN Foundation & Security

## Key Findings

### 1. JWT Authentication Best Practices (2026)
- **Access Token**: Short-lived (1 day for MVP), sent as `Authorization: Bearer <token>` header
- **HttpOnly Cookies**: Refresh tokens stored in HttpOnly+Secure+SameSite=Strict cookies to prevent XSS
- **Never store JWT in `localStorage`** — XSS vulnerability
- Use `bcrypt` with salt rounds ≥ 10 for password hashing
- Sign with `JWT_SECRET` from env vars — never hardcode

### 2. Backend Architecture (Routes → Controllers → Services → Models)
- **routes/**: Define endpoints, attach middleware
- **controllers/**: Parse requests, call service logic, send response
- **models/**: Mongoose schemas with validation
- **middleware/**: Auth check, role check, error handler, rate limiter

### 3. Security Middleware Stack
```js
app.use(helmet())                    // HTTP security headers
app.use(cors({ origin: ... }))       // Restrict cross-origin
app.use(express.json())              // JSON parsing
app.use('/api/auth', rateLimiter)    // Brute-force protection
```

### 4. Mongoose User Schema
- Index `email` field for fast lookup
- Use `select: false` on password field to hide it from default queries
- Pre-save hook for bcrypt hashing (or handle in controller)

### 5. React Frontend (Vite)
- **React Router v6**: `<BrowserRouter>`, `<Routes>`, `<Route>` for navigation
- **Axios**: HTTP client with an interceptor to attach JWT to every request
- **Zustand**: Lightweight auth store (`user`, `token`, `login()`, `logout()`)
- **Protected Routes**: Custom `<ProtectedRoute role="customer">` wrapper component

### 6. Pitfalls to Avoid
- Do NOT pass `req.body` directly to `mongoose.create()` — sanitize/whitelist fields first
- Do NOT expose `error.stack` in production API responses
- Always `await` async Mongoose operations inside `try/catch`
- Rate limit login routes to prevent brute-force attacks
