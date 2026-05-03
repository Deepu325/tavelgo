# Phase 1 UI Design Contract: Foundation & Security

**Status:** Ready for planning
**Visual Style:** Flat design (Clean, minimal, professional)

## 🎨 1. Visual Identity

### Color Palette
- **Primary**: `#2563EB` (Blue) — Used for primary buttons, active states, and branding.
- **Secondary**: `#10B981` (Green) — Used for success states and accent elements.
- **Background**: `#F9FAFB` (Light Gray) — Main page background.
- **Surface**: `#FFFFFF` (White) — Cards and modal backgrounds.
- **Text**: `#111827` (Dark Slate) — Main headings and body text.
- **Error**: `#EF4444` (Red) — Validation errors and destructive actions.

### Typography
- **Headings**: `Inter` / `Poppins` (Bold, `#111827`)
- **Body**: `Inter` (Regular, `#374151`)
- **Labels**: `Inter` (Medium, `#6B7280`)

## 🧱 2. Design System (ShadCN UI)

### Components
- **Buttons**:
  - Primary: Blue background, white text, 8px radius.
  - Ghost: No background, blue text, for secondary actions (e.g., "Forgot Password").
- **Inputs**:
  - Bordered style (`#D1D5DB`), focused ring (`#2563EB`).
  - Label above the input.
- **Cards**:
  - White background, subtle shadow, 12px radius.
- **Alerts**:
  - For login errors (Red border/background).

## 🔄 3. Interaction & Flow

### Login/Signup Flow
- **Entry**: Centered auth card on a clean background.
- **Validation**: Real-time field validation (Email format, Password length).
- **Transitions**: Smooth fade-in for form switching (Login <-> Signup).
- **Loading**: "Signing in..." state with a spinner on the primary button.

### Feedback
- **Success**: Redirect to dashboard with a brief "Welcome back!" toast.
- **Error**: Shake animation on the card + descriptive error message below the input.

## 📏 4. Layout & Spacing
- **Grid**: 8px system.
- **Auth Card**: Max-width `400px`, centered vertically and horizontally.
- **Padding**: `24px` (3rem) inside cards.
- **Gap**: `16px` (2rem) between form fields.

## ✍️ 5. Copywriting
- **Heading**: "Welcome to CabApp"
- **Sub-heading**: "Fast, transparent, and reliable booking."
- **Login CTA**: "Sign In"
- **Signup CTA**: "Create Account"
- **Switch Label**: "Don't have an account? Sign Up"

## 🛠️ 6. Implementation Notes
- Use `lucide-react` for icons (Mail, Lock, User, Eye/EyeOff).
- Ensure high contrast for accessibility (WCAG AA).
- Responsive: Card takes full width with padding on mobile.

---
*Phase: 01-foundation-security*
*Last updated: 2026-05-03*
