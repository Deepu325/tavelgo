# Technical Requirements Document

⚙️ TRD — Technical Requirements Document

🧠 Tech Stack (MERN)
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Deployment**: Render / Vercel

🧱 Architecture
- **Frontend (`/frontend`)**: Handles UI, state (Zustand), and API calls (Axios/Fetch) to the Express backend.
- **Backend (`/backend`)**: Exposes RESTful APIs, handles business logic, and interacts with MongoDB.

🗄️ Database Collections (MongoDB)

**Users**
- `_id`: ObjectId
- `name`: String
- `phone`: String
- `email`: String
- `password`: String (Hashed)
- `role`: Enum ('customer', 'driver', 'admin')

**Vehicles**
- `_id`: ObjectId
- `type`: String ('Hatchback', 'Sedan', 'SUV')
- `base_fare`: Number
- `per_km_rate`: Number
- `is_active`: Boolean

**Bookings**
- `_id`: ObjectId
- `customer`: ObjectId (ref: User)
- `driver`: ObjectId (ref: User)
- `pickup`: String
- `drop`: String
- `distance`: Number
- `fare`: Number
- `status`: Enum ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')

💰 Fare Logic
Fare = BaseFare + (Distance × Rate)
👉 Must be calculated server-side in the Express backend.

🔌 Integrations
- Optional: Google Maps API (distance)
- Otherwise: mock distance logic on the backend for MVP

🔐 Security
- Authentication: Custom JWT (JSON Web Tokens)
- Authorization: Middleware to verify user roles (Customer vs Driver).

⚡ State Management
- Zustand (Frontend)