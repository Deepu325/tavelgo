# Technical Requirements Document

⚙️ TRD — Technical Requirements Document

You suggested Next.js + Supabase, not MERN. That’s fine—but don’t mix stacks randomly.

🧠 Tech Stack (Clean Version)
- Frontend: Next.js (React)
- Styling: Tailwind CSS
- Components: ShadCN UI
- Backend: Supabase (Auth + DB)
- Deployment: Vercel

👉 This is actually cleaner than MERN for your scope.

🧱 Architecture
- Frontend handles UI + API calls
- Supabase handles:
  - Authentication
  - Database
  - Storage

🗄️ Database Tables (Supabase)

**Users**
- id
- name
- phone
- role

**Drivers**
- id
- user_id
- vehicle_type
- is_available

**Vehicles**
- type
- base_fare
- per_km_rate
- local_package

**Bookings**
- id
- user_id
- driver_id
- pickup
- drop
- distance
- fare
- status

💰 Fare Logic

Fare = BaseFare + (Distance × Rate)

👉 Must be calculated server-side (Supabase functions)

🔌 Integrations
- Optional: Google Maps API (distance)
- Otherwise: manual distance input

🔐 Security
- Supabase Auth
- Role-based row-level security (RLS)

👉 If you skip RLS, users can access others’ data. That’s a serious flaw.

⚡ State Management
- React Context or Zustand

👉 Don’t over-engineer with Redux unless needed.