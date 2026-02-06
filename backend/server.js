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

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Decode base64 token (in production, use JWT verify)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

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
  { id: '1', email: 'test@example.com', phone: '', subscribedAt: new Date().toISOString(), status: 'active' }
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

app.post('/api/events', authenticateToken, requireAdmin, (req, res) => {
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

app.put('/api/events/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const eventIndex = events.findIndex(e => e.id === id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  events[eventIndex] = { ...events[eventIndex], ...req.body };
  res.json(events[eventIndex]);
});

app.delete('/api/events/:id', authenticateToken, requireAdmin, (req, res) => {
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

app.get('/api/bookings', authenticateToken, (req, res) => {
  const { userId, role } = req.query;
  
  // If query has role=admin, verify the authenticated user is admin
  if (role === 'admin') {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    // Admin sees all bookings
    return res.json(bookings);
  }
  
  // User sees only their bookings (use authenticated user ID if available)
  const targetUserId = userId || req.user.id;
  const userBookings = bookings.filter(b => b.userId === targetUserId);
  res.json(userBookings);
});

app.put('/api/bookings/:id', authenticateToken, requireAdmin, (req, res) => {
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
  const { email, phone } = req.body;
  const trimmedEmail = (email || '').trim();
  const normalizedPhone = phone ? String(phone).replace(/[^\d]/g, '') : '';

  if (!trimmedEmail && !normalizedPhone) {
    return res.status(400).json({ error: 'Email or phone is required' });
  }
  if (trimmedEmail && subscribers.some(s => (s.email || '').toLowerCase() === trimmedEmail.toLowerCase())) {
    return res.status(409).json({ error: 'Email already subscribed' });
  }
  if (normalizedPhone && subscribers.some(s => (s.phone || '') === normalizedPhone)) {
    return res.status(409).json({ error: 'Phone already subscribed' });
  }
  const newSubscriber = { 
    id: Date.now().toString(),
    email: trimmedEmail, 
    phone: normalizedPhone || '',
    subscribedAt: new Date().toISOString(), 
    status: 'active' 
  };
  subscribers.push(newSubscriber);
  res.status(201).json(newSubscriber);
});

app.get('/api/subscribers', authenticateToken, requireAdmin, (req, res) => {
  res.json(subscribers);
});

app.delete('/api/subscribers/:email', authenticateToken, requireAdmin, (req, res) => {
  const identifier = req.params.email;
  const initialLength = subscribers.length;
  subscribers = subscribers.filter(s => s.email !== identifier && s.id !== identifier && s.phone !== identifier);
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
