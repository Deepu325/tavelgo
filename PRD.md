# Product Requirements Document

🧾 1. Product Definition

Product: Cab Booking Web App
Target Users:

- Daily commuters
- Local travelers
- Groups needing larger vehicles

Core Value:
👉 Fast booking + transparent pricing + simple driver interaction

If you fail at clarity in pricing → users won’t trust you.

🎯 2. Features (with Priority)

🔴 High Priority (MVP — MUST HAVE)
- User authentication (login/register)
- Enter pickup & drop
- Fare calculation
- Cab selection:
  - 5-Seater
  - Toyota Innova Crysta
  - Tempo Traveller
- Booking creation
- Driver accept/reject
- Ride status updates
- Booking history

🟡 Medium Priority
- Local package selection
- Driver availability toggle
- Admin pricing control

🟢 Low Priority
- Ratings
- Notifications
- GPS tracking

👉 If you try to build everything at once, you’ll finish nothing.

🔄 3. User Flow (Detailed)

🚖 Booking Flow
- User logs in
- Inputs pickup & drop
- System calculates distance
- Shows cab options + pricing
- User selects cab
- Confirms booking
- System assigns driver
- Driver accepts
- Ride starts → completes

⚠️ 4. Edge Cases
- No driver available
- Driver rejects ride
- User cancels booking
- Invalid location input
- Pricing mismatch

👉 Ignore these and your app breaks in real usage.

🔐 5. Authentication & Access

JWT-based login
Roles:
- Customer
- Driver
- Admin

Rules:
- Only drivers see ride requests
- Only admin can edit pricing

📊 6. Success Metrics
- Booking success rate > 90%
- Booking time < 2 minutes
- Error rate < 5%

👉 If you don’t define metrics, you can’t judge success.