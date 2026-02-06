/**
 * API Utility Functions
 * Centralized API calls for frontend-backend communication
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Get authorization token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Create headers with authorization token if available
 */
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Handle API response and errors
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/';
      throw new Error('Unauthorized. Please login again.');
    }
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ==================== AUTH API ====================

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

/**
 * Login API call
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(credentials),
  });
  return handleResponse<AuthResponse>(response);
};

/**
 * Logout API call
 */
export const logout = async (): Promise<void> => {
  const token = getAuthToken();
  if (token) {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: getHeaders(true),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

// ==================== EVENTS API ====================

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  price?: number;
  imageUrl?: string;
  organizer: string;
  featured?: boolean;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  price?: number;
  imageUrl?: string;
  organizer: string;
  featured?: boolean;
}

/**
 * Get all events
 */
export const getEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_URL}/api/events`, {
    method: 'GET',
    headers: getHeaders(false),
  });
  return handleResponse<Event[]>(response);
};

/**
 * Get single event by ID
 */
export const getEvent = async (id: string): Promise<Event> => {
  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'GET',
    headers: getHeaders(false),
  });
  return handleResponse<Event>(response);
};

/**
 * Create new event
 */
export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
  const response = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(eventData),
  });
  return handleResponse<Event>(response);
};

/**
 * Update event
 */
export const updateEvent = async (id: string, eventData: Partial<CreateEventData>): Promise<Event> => {
  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(eventData),
  });
  return handleResponse<Event>(response);
};

/**
 * Delete event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
};

// ==================== BOOKINGS API ====================

export interface BookingRequest {
  id: string;
  userId?: string;
  eventId: string;
  eventName: string;
  userName: string;
  userEmail: string;
  phone?: string;
  guestCount: number;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  adminNote?: string;
}

export interface CreateBookingData {
  eventId: string;
  userName: string;
  userEmail: string;
  guestCount: number;
  phone?: string;
  message?: string;
  userId?: string;
}

export interface UpdateBookingData {
  status?: 'Pending' | 'Approved' | 'Rejected';
  adminNote?: string;
}

/**
 * Get all bookings (admin) or user's bookings
 */
export const getBookings = async (userId?: string, role?: string): Promise<BookingRequest[]> => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (role) params.append('role', role);
  
  const queryString = params.toString();
  const url = `${API_URL}/api/bookings${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(true),
  });
  return handleResponse<BookingRequest[]>(response);
};

/**
 * Create booking request
 */
export const createBooking = async (bookingData: CreateBookingData): Promise<BookingRequest> => {
  const response = await fetch(`${API_URL}/api/bookings`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(bookingData),
  });
  return handleResponse<BookingRequest>(response);
};

/**
 * Update booking status (admin only)
 */
export const updateBooking = async (id: string, updateData: UpdateBookingData): Promise<BookingRequest> => {
  const response = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(updateData),
  });
  return handleResponse<BookingRequest>(response);
};

// ==================== SUBSCRIBERS API ====================

export interface Subscriber {
  id?: string;
  email: string;
  subscribedAt?: string;
  status?: 'active' | 'unsubscribed';
}

/**
 * Get all subscribers (admin only)
 */
export const getSubscribers = async (): Promise<Subscriber[]> => {
  const response = await fetch(`${API_URL}/api/subscribers`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  return handleResponse<Subscriber[]>(response);
};

/**
 * Add new subscriber
 */
export const addSubscriber = async (email: string): Promise<Subscriber> => {
  const response = await fetch(`${API_URL}/api/subscribers`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email }),
  });
  return handleResponse<Subscriber>(response);
};

/**
 * Delete subscriber (admin only)
 */
export const deleteSubscriber = async (email: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/subscribers/${email}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  if (!response.ok) {
    throw new Error('Failed to delete subscriber');
  }
};

