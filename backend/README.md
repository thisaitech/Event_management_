# Eventic Backend

Backend API server for Eventic platform built with Node.js and Express.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```bash
# Copy from .env.example if exists, or create new
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

Or:
```bash
npm start
```

The server will run on `http://localhost:3001` (or the PORT specified in .env)

## API Endpoints

### Authentication
- `POST /api/login` - User authentication
  - Body: `{ username, password }`
  - Returns: `{ token, user: { id, username, role } }`

- `POST /api/logout` - User logout
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message: 'Logged out successfully' }`

### Events
- `GET /api/events` - Get all events
  - Query params: `category`, `location`, `date` (optional)
  - Returns: Array of events

- `GET /api/events/:id` - Get single event by ID
  - Returns: Event object

- `POST /api/events` - Create new event (admin)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title, description, date, location, category, price, imageUrl, organizer, featured }`
  - Returns: Created event

- `PUT /api/events/:id` - Update event (admin)
  - Headers: `Authorization: Bearer <token>`
  - Body: Partial event data
  - Returns: Updated event

- `DELETE /api/events/:id` - Delete event (admin)
  - Headers: `Authorization: Bearer <token>`
  - Returns: 204 No Content

### Bookings
- `GET /api/bookings` - Get bookings
  - Query params: `userId` (for user bookings), `role=admin` (for all bookings)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of bookings

- `POST /api/bookings` - Create booking request
  - Headers: `Authorization: Bearer <token>` (optional)
  - Body: `{ eventId, userName, userEmail, guestCount, phone, message, userId }`
  - Returns: Created booking

- `PUT /api/bookings/:id` - Update booking status (admin)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ status: 'Approved' | 'Rejected', adminNote?: string }`
  - Returns: Updated booking

### Subscribers
- `GET /api/subscribers` - Get all subscribers (admin)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of subscribers

- `POST /api/subscribers` - Add subscriber
  - Body: `{ email }`
  - Returns: Created subscriber

- `DELETE /api/subscribers/:email` - Delete subscriber (admin)
  - Headers: `Authorization: Bearer <token>`
  - Returns: 204 No Content

## Demo Users

- **User**: username: `user1`, password: `pass123`
- **Admin**: username: `admin`, password: `admin123`

## Notes

- Currently uses in-memory storage (replace with MongoDB in production)
- CORS is enabled for frontend origin specified in FRONTEND_URL
- JWT tokens recommended for production (currently using base64 encoded tokens)
- All data is reset when server restarts (in-memory storage)

## Production Considerations

1. Replace in-memory storage with MongoDB/PostgreSQL
2. Implement proper JWT token authentication
3. Add input validation and sanitization
4. Add rate limiting
5. Add proper error logging
6. Use environment variables for sensitive data
7. Add database migrations
8. Implement proper password hashing

