# Research: Project Stack

Standard 2025/2026 stack for a Cab Booking Web App using Next.js and Supabase.

## Recommended Stack

| Component | Technology | Version | Rationale |
|-----------|------------|---------|-----------|
| **Frontend** | Next.js | v16.2.x | Latest stable with optimized Server Actions and App Router performance. |
| **Styling** | Tailwind CSS | v4.2.x | Modern, utility-first CSS with improved build speeds and JIT engine. |
| **Components** | shadcn/ui | v4.6.x | Accessible, customizable components that integrate perfectly with Tailwind. |
| **Icons** | Lucide React | v1.14.x | Lightweight, consistent icon set. |
| **Backend/Auth**| Supabase | Latest | All-in-one solution for Auth, DB, and RLS. |
| **Database** | PostgreSQL | — | Industry standard, provided via Supabase. |
| **State** | Zustand | v5.x | Simpler and faster than Redux for local/global UI state. |
| **Deployment** | Vercel | — | First-class support for Next.js features and CI/CD. |

## Rationale
- **Next.js Server Actions**: Eliminates the need for a separate API layer for most database interactions, significantly reducing boilerplate.
- **Supabase Auth + RLS**: Provides production-grade security out of the box. Role-level security is essential for separating Driver and Customer data.
- **ShadCN UI**: High-quality, accessible components mean we spend more time on logic and less on CSS debugging.

## What NOT to use
- **Redux**: Overkill for this scope. Zustand or even React Context is sufficient.
- **Custom Auth**: Don't roll your own. Supabase Auth handles edge cases like password resets and session management securely.
- **Express/Node (separate)**: Next.js App Router and Server Actions handle all backend needs for this project.

## Confidence Levels
- **Next.js + Supabase**: 100% (Industry standard for this type of app)
- **Zustand**: 95% (Excellent for ride status and user state)
- **Tailwind v4**: 100% (Best-in-class for rapid UI development)

---
*Last updated: 2026-05-03*
