# Eventic - Event Booking Web Application

A complete event booking platform built with React/TypeScript frontend and Node.js/Express backend.

## Features

1. **Main Page (Homepage/Hero Section)**
   - Full-screen hero with elegant banquet hall background
   - Search form with category dropdown, location, and date inputs
   - "Search & Book" functionality
   - Trust badges display
   - Navigation with login/logout

2. **Booking System**
   - Event booking modal with form
   - User information capture (name, email, tickets, payment method)
   - Booking submission with status tracking
   - Booking confirmation messages

3. **Authentication**
   - Login modal with username/password
   - Demo credentials:
     - User: `user1` / `pass123`
     - Admin: `admin` / `admin123`
   - Session management with localStorage
   - User-specific features (My Bookings)

4. **My Bookings Page**
   - View all bookings for logged-in users
   - Admin view: See all bookings with approve/reject functionality
   - Booking status tracking (Pending/Approved/Rejected)
   - Admin notes/comments on bookings

5. **Admin Features**
   - View all bookings
   - Approve or reject bookings
   - Add admin notes to bookings
   - Update booking status

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion (via React Bits components)
- **Backend**: Node.js, Express.js
- **Storage**: In-memory (can be replaced with MongoDB)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server (frontend):
```bash
npm run dev
```

3. Start the backend server (in a separate terminal):
```bash
npm run server
```

Or run both simultaneously:
```bash
npm run dev:full
```

## Running the Application

1. **Start the Backend Server**:
   - Open a terminal and run: `npm run server`
   - Server will start on `http://localhost:3001`

2. **Start the Frontend**:
   - Open another terminal and run: `npm run dev`
   - Frontend will start on `http://localhost:5173` (or another port)

3. **Access the Application**:
   - Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)

## API Endpoints

### Authentication
- `POST /api/login` - Login with username and password
- `POST /api/logout` - Logout (session cleanup)

### Events
- `GET /api/events` - Get all events (supports query params: category, location, date)
- `GET /api/events/:id` - Get specific event by ID

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings?userId=xxx&role=user` - Get user's bookings
- `GET /api/bookings?role=admin` - Get all bookings (admin only)
- `PUT /api/bookings/:id` - Update booking status (admin only)

## Demo Credentials

**Regular User:**
- Username: `user1`
- Password: `pass123`

**Admin User:**
- Username: `admin`
- Password: `admin123`

## Usage Flow

1. **Browse Events**: View featured events on the homepage
2. **Search Events**: Use the search form in the hero section
3. **Book Event**: Click on an event card to open the booking modal
4. **Login**: Click "Sign In" to access user features
5. **View Bookings**: After login, click "My Bookings" button (bottom right)
6. **Admin Functions**: Login as admin to approve/reject bookings

## Project Structure

```
├── components/
│   ├── BookingModal.tsx      # Booking form modal
│   ├── LoginModal.tsx        # Login form modal
│   ├── Hero.tsx              # Hero section with search
│   └── pages/
│       └── MyBookings.tsx    # Bookings management page
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── server.mjs                # Express backend server
└── App.tsx                   # Main application component
```

## Notes

- The backend uses in-memory storage (data resets on server restart)
- For production, replace with MongoDB or another database
- Authentication uses simple base64 tokens (replace with JWT for production)
- All bookings start with "Pending" status
- Admin can approve/reject bookings and add notes

## Future Enhancements

- MongoDB integration for persistent storage
- JWT-based authentication
- Email notifications for booking status changes
- Payment gateway integration
- Event organizer dashboard
- Advanced search and filtering
- Booking cancellation functionality

