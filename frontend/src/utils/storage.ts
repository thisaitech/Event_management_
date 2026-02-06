/**
 * LocalStorage Utility Functions
 * Browser-based storage for demo purposes (replaces backend API)
 */

// Storage keys
const STORAGE_KEYS = {
  USERS: 'eventic_users',
  EVENTS: 'eventic_events',
  BOOKINGS: 'eventic_bookings',
  SUBSCRIBERS: 'eventic_subscribers',
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
} as const;

// ==================== INITIALIZATION ====================

/**
 * Initialize demo data if storage is empty
 */
const initializeDemoData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      { id: '1', username: 'user1', password: 'pass123', role: 'user' },
      { id: '2', username: 'admin', password: 'admin123', role: 'admin' }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // Initialize events if not exists
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    const defaultEvents = [
      {
        id: '1',
        title: 'Premium Wedding Celebration',
        description: 'Elegant wedding event with premium catering, decoration, and music arrangements.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Chennai',
        category: 'Wedding',
        price: 50000,
        imageUrl: 'https://picsum.photos/800/600?random=1',
        organizer: 'Premium Events Co.',
        featured: true
      },
      {
        id: '2',
        title: 'Corporate Annual Gala',
        description: 'Professional corporate event with conference facilities and networking opportunities.',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Coimbatore',
        category: 'Corporate',
        price: 75000,
        imageUrl: 'https://picsum.photos/800/600?random=2',
        organizer: 'Event Managers Inc.',
        featured: true
      },
      {
        id: '3',
        title: 'Cultural Festival 2025',
        description: 'Traditional cultural festival with performances, food stalls, and cultural showcases.',
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Madurai',
        category: 'Festival',
        price: 30000,
        imageUrl: 'https://picsum.photos/800/600?random=3',
        organizer: 'Cultural Society',
        featured: false
      },
      {
        id: '4',
        title: 'Business Conference',
        description: 'Industry-leading business conference with keynote speakers and workshops.',
        date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Tiruchirappalli',
        category: 'Conference',
        price: 40000,
        imageUrl: 'https://picsum.photos/800/600?random=4',
        organizer: 'Business Network',
        featured: false
      },
      {
        id: '5',
        title: 'Grand Gala Dinner',
        description: 'Exclusive gala dinner with fine dining and entertainment.',
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Salem',
        category: 'Gala',
        price: 60000,
        imageUrl: 'https://picsum.photos/800/600?random=5',
        organizer: 'Luxury Events',
        featured: true
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
  }

  // Initialize bookings if not exists
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }

  // Initialize subscribers if not exists
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
    const defaultSubscribers = [
      { id: '1', email: 'demo@example.com', phone: '', subscribedAt: new Date().toISOString(), status: 'active' }
    ];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(defaultSubscribers));
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  initializeDemoData();
}

// ==================== HELPER FUNCTIONS ====================

const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    // Try to parse JSON, but handle errors gracefully
    const parsed = JSON.parse(item);
    return parsed || defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    // If parsing fails, clear the corrupted data and return default
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore removal errors
    }
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event to notify components in the same tab
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('localStorageUpdated'));
    }
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    throw error;
  }
};

// ==================== AUTH ====================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'user' | 'admin';
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const users = getItem<any[]>(STORAGE_KEYS.USERS, []);
  const user = users.find(
    u => u.username === credentials.username && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Create simple token (just base64 encoded user data)
  const token = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role }));

  const authResponse: AuthResponse = {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };

  // Store auth data
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authResponse.user));

  return authResponse;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
};

// ==================== EVENTS ====================

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  price: number;
  imageUrl: string;
  organizer?: string;
  featured?: boolean;
}

export const getEvents = async (): Promise<Event[]> => {
  return getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  const events = getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
  const newEvent: Event = {
    ...eventData,
    id: Date.now().toString(),
  };
  events.push(newEvent);
  setItem(STORAGE_KEYS.EVENTS, events);
  return newEvent;
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  const events = getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
  const index = events.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Event not found');
  }
  events[index] = { ...events[index], ...eventData };
  setItem(STORAGE_KEYS.EVENTS, events);
  return events[index];
};

export const deleteEvent = async (id: string): Promise<void> => {
  const events = getItem<Event[]>(STORAGE_KEYS.EVENTS, []);
  const filtered = events.filter(e => e.id !== id);
  setItem(STORAGE_KEYS.EVENTS, filtered);
};

// ==================== BOOKINGS ====================

export interface BookingRequest {
  id: string;
  eventId: string;
  userName: string;
  userEmail?: string;
  phone: string;
  guestCount: number;
  message?: string;
  userId?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  eventId: string;
  userName: string;
  userEmail?: string;
  phone: string;
  guestCount: number;
  message?: string;
  userId?: string;
}

export interface UpdateBookingData {
  status?: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
}

export const getBookings = async (userId?: string): Promise<BookingRequest[]> => {
  const bookings = getItem<BookingRequest[]>(STORAGE_KEYS.BOOKINGS, []);
  if (userId) {
    return bookings.filter(b => b.userId === userId);
  }
  return bookings;
};

export const createBooking = async (bookingData: CreateBookingData): Promise<BookingRequest> => {
  const bookings = getItem<BookingRequest[]>(STORAGE_KEYS.BOOKINGS, []);
  const now = new Date().toISOString();
  const newBooking: BookingRequest = {
    ...bookingData,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  bookings.push(newBooking);
  setItem(STORAGE_KEYS.BOOKINGS, bookings);
  return newBooking;
};

export const updateBooking = async (id: string, bookingData: UpdateBookingData): Promise<BookingRequest> => {
  const bookings = getItem<BookingRequest[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) {
    throw new Error('Booking not found');
  }
  bookings[index] = {
    ...bookings[index],
    ...bookingData,
    updatedAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings[index];
};

// ==================== SUBSCRIBERS ====================

export interface Subscriber {
  id: string;
  email: string;
  phone?: string;
  subscribedAt: string;
  status: string;
}

export const getSubscribers = async (): Promise<Subscriber[]> => {
  return getItem<Subscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
};

export const addSubscriber = async (email: string, phone?: string): Promise<Subscriber> => {
  const subscribers = getItem<Subscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);

  const trimmedEmail = email?.trim() || '';
  const normalizedPhone = phone ? phone.replace(/[^\d]/g, '') : '';

  // Require at least one contact method
  if (!trimmedEmail && !normalizedPhone) {
    throw new Error('Email or phone is required');
  }

  // Check if already subscribed by email or phone
  if (trimmedEmail && subscribers.some(s => s.email.toLowerCase() === trimmedEmail.toLowerCase())) {
    throw new Error('Email already subscribed');
  }
  if (normalizedPhone && subscribers.some(s => (s.phone || '').replace(/[^\d]/g, '') === normalizedPhone)) {
    throw new Error('Phone already subscribed');
  }

  const newSubscriber: Subscriber = {
    id: Date.now().toString(),
    email: trimmedEmail,
    phone: normalizedPhone || undefined,
    subscribedAt: new Date().toISOString(),
    status: 'active',
  };
  subscribers.push(newSubscriber);
  setItem(STORAGE_KEYS.SUBSCRIBERS, subscribers);
  return newSubscriber;
};

export const deleteSubscriber = async (identifier: string): Promise<void> => {
  const subscribers = getItem<Subscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
  const filtered = subscribers.filter(s =>
    s.email !== identifier &&
    s.id !== identifier &&
    (s.phone || '') !== identifier
  );
  setItem(STORAGE_KEYS.SUBSCRIBERS, filtered);
};
