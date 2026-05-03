# Phase 2 UI Design Contract: Booking Engine

**Status:** Ready for planning
**Visual Style:** Flat design (Clean, minimal, high contrast)

## 🎨 1. Visual Identity (Extended)

### Component Colors
- **Vehicle Selection (Active)**: `#2563EB` (Blue border/shadow).
- **Fare Estimate**: `#111827` (Large bold font).
- **Booking CTA**: `#2563EB` (Primary blue).

## 🧱 2. Design System (ShadCN UI)

### Components
- **Select**: For vehicle type selection.
- **Input**: For pickup and drop locations (text-based for MVP).
- **Cards**: For each vehicle type option (Hatchback, Sedan, SUV).
- **Badge**: To display "Fastest" or "Best Value" on vehicle cards.

## 🔄 3. Interaction & Flow

### Booking Process
1. **Input**: User enters pickup and drop locations.
2. **Estimation**: System calculates distance and displays fare for each vehicle type.
3. **Selection**: User taps a vehicle card to select it.
4. **Submission**: User clicks "Confirm Booking".
5. **Transition**: Form fades out, "Searching for Driver..." overlay appears with a pulse animation.

### Dynamic States
- **Loading**: Skeleton loaders for fare estimates while calculating.
- **Error**: Inline error messages if locations are invalid.
- **Success**: Confetti or subtle checkmark on booking confirmation.

## 📏 4. Layout & Spacing
- **Form Layout**: Single column on mobile, two columns on desktop.
- **Vehicle Grid**: Horizontal scroll on mobile, grid on desktop.
- **Card Spacing**: `12px` gap between vehicle options.

## ✍️ 5. Copywriting
- **Form Heading**: "Where to?"
- **Pickup Label**: "Pick-up Location"
- **Drop Label**: "Drop-off Location"
- **Estimate Label**: "Estimated Fare"
- **CTA**: "Book [Vehicle Type] Now"

## 🛠️ 6. Implementation Notes
- Use `lucide-react` icons for vehicles (Car, Truck, Zap).
- Ensure the "Confirm" button is sticky on mobile for better accessibility.

---
*Phase: 02-booking-engine*
*Last updated: 2026-05-03*
