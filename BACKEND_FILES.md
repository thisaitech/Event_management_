# Backend Files to Create

Since there's a conflict with the backend folder, create these files manually or use the terminal commands below.

## Files Needed in `backend/` folder:

### 1. `backend/server.js`

Create this file with the content from the code block below.

### 2. `backend/package.json`

Create this file with the package.json content.

### 3. `backend/.env.example`

Create this file with environment variable examples.

### 4. `backend/README.md`

Create this file with backend documentation.

## Terminal Commands (Windows PowerShell)

```powershell
# Remove the backend file if it exists as a file
Remove-Item backend -ErrorAction SilentlyContinue

# Create backend directory
New-Item -ItemType Directory -Path backend

# Then create the files using the content below
```

## Terminal Commands (Mac/Linux)

```bash
# Remove backend if it's a file
rm -f backend

# Create backend directory
mkdir backend

# Then create the files using the content below
```

---

## File Contents

### backend/server.js

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware - Enable CORS for frontend
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// In-memory storage (replace with MongoDB in production)
let users = [
  { id: '1', username: 'user1', password: 'pass123', role: 'user' },
  { id: '2', username: 'admin', password: 'admin123', role: 'admin' }
];

let bookings = [
  {
    id: '1',
    userId: '1',
    eventId: '1',
    eventName: 'Summer Music Festival 2024',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    phone: '+1234567890',
    guestCount: 150,
    tickets: 150,
    message: 'Looking for a premium venue for our annual music festival. Need stage setup and catering.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    adminNote: null
  },
  {
    id: '2',
    userId: '1',
    eventId: '2',
    eventName: 'AI & Future Tech Summit',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    phone: '+1234567890',
    guestCount: 200,
    tickets: 200,
    message: 'Corporate conference with networking sessions',
    status: 'Approved',
    createdAt: new Date().toISOString(),
    adminNote: 'Venue confirmed for 200 guests. Catering and AV setup arranged.'
  }
];

let events = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: 'The biggest outdoor music experience of the year featuring top international artists.',
    date: '2024-07-15',
    location: 'Central Park, New York',
    category: 'Music',
    price: 120,
    imageUrl: 'https://picsum.photos/seed/music/800/600',
    organizer: 'Vibe Events',
    featured: true
  },
  {
    id: '2',
    title: 'AI & Future Tech Summit',
    description: 'Join industry leaders to discuss the next frontier of artificial intelligence and robotics.',
    date: '2024-08-22',
    location: 'Convention Center, San Francisco',
    category: 'Technology',
    price: 499,
    imageUrl: 'https://picsum.photos/seed/tech/800/600',
    organizer: 'TechConnect',
    featured: true
  },
  {
    id: '3',
    title: 'Gourmet Food Tour',
    description: 'A curated journey through the city\'s hidden culinary gems and Michelin-starred bites.',
    date: '2024-06-10',
    location: 'Downtown, Chicago',
    category: 'Food & Drink',
    price: 85,
    imageUrl: 'https://picsum.photos/seed/food/800/600',
    organizer: 'Taste Hunters',
    featured: false
  },
  {
    id: '4',
    title: 'Contemporary Art Expo',
    description: 'Explore breathtaking works from emerging artists across the globe.',
    date: '2024-09-05',
    location: 'Modern Art Gallery, London',
    category: 'Art',
    price: 45,
    imageUrl: 'https://picsum.photos/seed/art/800/600',
    organizer: 'ArtScape',
    featured: false
  },
  {
    id: '5',
    title: 'Startup Pitch Night',
    description: 'Watch the hottest new startups pitch to elite venture capitalists.',
    date: '2024-10-12',
    location: 'Innovation Hub, Austin',
    category: 'Business',
    price: 25,
    imageUrl: 'https://picsum.photos/seed/business/800/600',
    organizer: 'Ventures X',
    featured: false
  }
];

let subscribers = [
  { id: '1', email: 'test@example.com', subscribedAt: new Date().toISOString(), status: 'active' }
];

// Auth routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // In production, use JWT tokens
  const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role })).toString('base64');
  
  res.json({ 
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Events routes
app.get('/api/events', (req, res) => {
  const { category, location, date } = req.query;
  
  let filteredEvents = [...events];
  
  if (category) {
    filteredEvents = filteredEvents.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }
  
  if (location) {
    filteredEvents = filteredEvents.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));
  }
  
  if (date) {
    filteredEvents = filteredEvents.filter(e => e.date === date);
  }
  
  res.json(filteredEvents);
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  res.json(event);
});

app.post('/api/events', (req, res) => {
  const { title, description, date, location, category, price, imageUrl, organizer, featured } = req.body;
  
  if (!title || !date || !location || !category || !organizer) {
    return res.status(400).json({ error: 'Title, date, location, category, and organizer are required' });
  }
  
  const newEvent = {
    id: Date.now().toString(),
    title,
    description: description || '',
    date,
    location,
    category,
    price: price || 0,
    imageUrl: imageUrl || 'https://picsum.photos/800/600',
    organizer,
    featured: featured || false
  };
  
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const eventIndex = events.findIndex(e => e.id === id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  events[eventIndex] = { ...events[eventIndex], ...req.body };
  res.json(events[eventIndex]);
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const eventIndex = events.findIndex(e => e.id === id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  events.splice(eventIndex, 1);
  res.status(204).send();
});

// Bookings routes
app.post('/api/bookings', (req, res) => {
  const { eventId, userName, userEmail, guestCount, phone, message, userId } = req.body;
  
  if (!eventId || !userName || !userEmail || !guestCount) {
    return res.status(400).json({ error: 'Event, name, email, and guest count are required' });
  }
  
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const booking = {
    id: Date.now().toString(),
    userId: userId || 'guest',
    eventId,
    eventName: event.title,
    userName,
    userEmail,
    phone: phone || null,
    guestCount: parseInt(guestCount),
    tickets: parseInt(guestCount), // For backward compatibility
    message: message || null,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    adminNote: null
  };
  
  bookings.push(booking);
  
  res.status(201).json({ 
    message: 'Booking requested. Awaiting admin approval.',
    ...booking
  });
});

app.get('/api/bookings', (req, res) => {
  const { userId, role } = req.query;
  
  if (role === 'admin') {
    // Admin sees all bookings
    return res.json(bookings);
  }
  
  // User sees only their bookings
  const userBookings = bookings.filter(b => b.userId === userId);
  res.json(userBookings);
});

app.put('/api/bookings/:id', (req, res) => {
  const { status, adminNote } = req.body;
  const { id } = req.params;
  
  const bookingIndex = bookings.findIndex(b => b.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    status: status || bookings[bookingIndex].status,
    adminNote: adminNote !== undefined ? adminNote : bookings[bookingIndex].adminNote,
    updatedAt: new Date().toISOString()
  };
  
  res.json(bookings[bookingIndex]);
});

// Subscribers routes
app.post('/api/subscribers', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (subscribers.some(s => s.email === email)) {
    return res.status(409).json({ error: 'Email already subscribed' });
  }
  const newSubscriber = { 
    id: Date.now().toString(),
    email, 
    subscribedAt: new Date().toISOString(), 
    status: 'active' 
  };
  subscribers.push(newSubscriber);
  res.status(201).json(newSubscriber);
});

app.get('/api/subscribers', (req, res) => {
  res.json(subscribers);
});

app.delete('/api/subscribers/:email', (req, res) => {
  const { email } = req.params;
  const initialLength = subscribers.length;
  subscribers = subscribers.filter(s => s.email !== email);
  if (subscribers.length === initialLength) {
    return res.status(404).json({ error: 'Subscriber not found' });
  }
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});
```

### backend/package.json

```json
{
  "name": "eventic-backend",
  "version": "1.0.0",
  "type": "module",
  "description": "Backend API server for Eventic platform",
  "main": "server.js",
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.22.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21"
  }
}
```

### backend/.env.example

```
# Backend Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### backend/README.md

```markdown
# Eventic Backend

Backend API server for Eventic platform built with Node.js and Express.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create \`.env\` file (copy from \`.env.example\`):
\`\`\`bash
cp .env.example .env
\`\`\`

3. Configure environment variables in \`.env\`:
\`\`\`
PORT=3001
FRONTEND_URL=http://localhost:3000
\`\`\`

## Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The server will run on \`http://localhost:3001\`

## API Endpoints

- \`POST /api/login\` - User authentication
- \`POST /api/logout\` - User logout
- \`GET /api/events\` - Get all events
- \`POST /api/events\` - Create new event (admin)
- \`PUT /api/events/:id\` - Update event (admin)
- \`DELETE /api/events/:id\` - Delete event (admin)
- \`GET /api/bookings\` - Get bookings (filtered by user/role)
- \`POST /api/bookings\` - Create booking request
- \`PUT /api/bookings/:id\` - Update booking status (admin)
- \`GET /api/subscribers\` - Get all subscribers (admin)
- \`POST /api/subscribers\` - Add subscriber
- \`DELETE /api/subscribers/:email\` - Delete subscriber (admin)

## Notes

- Currently uses in-memory storage (replace with MongoDB in production)
- CORS is enabled for frontend origin
- JWT tokens recommended for production (currently using base64 encoded tokens)
```

