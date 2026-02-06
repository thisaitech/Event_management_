import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FadeIn } from '../react-bits/FadeIn';
import { AnimatedText } from '../react-bits/AnimatedText';
// Import API functions instead of storage utilities
// Import API functions from utils
import { 
  getSubscribers as apiGetSubscribers,
  deleteSubscriber as apiDeleteSubscriber,
  getUsers as apiGetUsers,
  getBookings as apiGetBookings,
  updateBooking as apiUpdateBooking,
  getEvents as apiGetEvents,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
  createEvent as apiCreateEvent,
  Subscriber,
  User as UserType,
  BookingRequest,
  Event as EventType
} from '@/utils/storage';
import { formatPriceInRupees } from '@/utils/currency';

// Define Event interface that matches what we use in AdminPanel
interface AdminEvent {
  id: string;
  title: string;
  name?: string; // Legacy support
  description?: string;
  date: string;
  location: string;
  category: string;
  price?: number;
  imageUrl?: string;
  organizer: string;
  featured?: boolean;
}

type BookingWithEvent = BookingRequest & {
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
};

interface AdminPanelProps {
  onBack?: () => void;
  onLogout?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout }) => {
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useToast();
  
  // Use onLogout if provided, otherwise use logout from context
  const handleLogout = onLogout || logout;
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userBookingsModalId, setUserBookingsModalId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'bookings' | 'users' | 'events' | 'subscribers'>('bookings');
  const [bookingPage, setBookingPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [subscriberPage, setSubscriberPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailsBooking, setDetailsBooking] = useState<BookingWithEvent | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    date: '',
    location: '',
    category: '',
    organizer: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Check admin access
    if (!isAdmin || !user) {
      showToast('Access Denied. Admin privileges required.', 'error');
      if (onBack) {
        onBack();
      } else {
        // If no onBack, redirect by logging out (which will show login modal)
        logout();
      }
      return;
    }
    
    loadData();

    // Listen for storage changes to keep data in sync
    const handleStorageChange = (e: StorageEvent) => {
      // Reload data when localStorage changes
      if (
        e.key === 'eventic_events' ||
        e.key === 'eventic_bookings' ||
        e.key === 'eventic_subscribers' ||
        e.key === 'eventic_users' ||
        e.key === null
      ) {
        loadData();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageEvent = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageEvent);
    };
  }, [isAdmin, user]);

  useEffect(() => {
    if (!detailsBooking && !userBookingsModalId) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [detailsBooking, userBookingsModalId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch all data from API
      const [subscribersData, bookingsData, eventsData, usersData] = await Promise.all([
        apiGetSubscribers().catch(() => []),
        apiGetBookings(undefined).catch(() => []), // Admin sees all bookings
        apiGetEvents().catch(() => []),
        apiGetUsers().catch(() => [])
      ]);
      
      setSubscribers(subscribersData);
      setUsers(usersData);
      // Convert bookings to include eventName and normalize status
      const convertedBookings: BookingWithEvent[] = bookingsData.map((b: any) => {
        const event = eventsData.find((e: any) => e.id === b.eventId);
        // Normalize status to capitalized format
        const normalizedStatus = b.status ? 
          b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase() : 
          'Pending';
        // Get event name - check both title and name properties
        const eventName = event?.title || event?.name || b.eventName || 'Unknown Event';
        const eventDate = event?.date || b.eventDate || b.date || '';
        const eventLocation = event?.location || b.eventLocation || b.location || '';
        return {
          ...b,
          status: normalizedStatus,
          eventName: eventName,
          eventDate,
          eventLocation
        };
      });
      setBookings(convertedBookings);
      // Convert API events to component format
      const convertedEvents: AdminEvent[] = eventsData.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description || '',
        date: e.date,
        location: e.location,
        category: e.category,
        price: e.price || 0,
        imageUrl: e.imageUrl || '',
        organizer: e.organizer || '',
        featured: e.featured || false
      }));
      setEvents(convertedEvents);
    } catch (error) {
      console.error('Error loading admin data:', error);
      showToast('Failed to load data. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (id: string) => {
    setActionLoading(id);
    try {
      await apiUpdateBooking(id, { 
        status: 'approved', 
        adminNote: adminNote || undefined 
      });
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('localStorageUpdated'));
      await loadData(); // Reload all data
      setDetailsBooking(null);
      setAdminNote('');
      showToast('Booking approved successfully', 'success');
    } catch (error) {
      console.error('Error approving booking:', error);
      showToast('Failed to approve booking. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (id: string) => {
    setActionLoading(id);
    try {
      await apiUpdateBooking(id, { 
        status: 'rejected', 
        adminNote: adminNote || undefined 
      });
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('localStorageUpdated'));
      await loadData(); // Reload all data
      setDetailsBooking(null);
      setAdminNote('');
      showToast('Booking rejected', 'success');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      showToast('Failed to reject booking. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiDeleteEvent(id);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('localStorageUpdated'));
        await loadData(); // Reload all data
        showToast('Event deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Failed to delete event. Please try again.', 'error');
      }
    }
  };

  const handleEditEvent = (event: AdminEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      price: event.price?.toString() || '',
      imageUrl: event.imageUrl || '',
      date: event.date || '',
      location: event.location || '',
      category: event.category || '',
      organizer: event.organizer || ''
    });
    setImagePreview(event.imageUrl || null);
    setImageFile(null);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'warning');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'warning');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setEventForm({ ...eventForm, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setEventForm({ ...eventForm, imageUrl: '' });
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.location || !eventForm.category || !eventForm.organizer) {
      showToast('Please fill in all required fields (Title, Date, Location, Category, Organizer)', 'warning');
      return;
    }

    try {
      const eventData = {
        title: eventForm.title,
        description: eventForm.description || '',
        price: eventForm.price ? parseFloat(eventForm.price) : undefined,
        imageUrl: imagePreview || eventForm.imageUrl || 'https://picsum.photos/800/600',
        date: eventForm.date,
        location: eventForm.location,
        category: eventForm.category,
        organizer: eventForm.organizer,
        featured: editingEvent?.featured || false
      };

      if (editingEvent && editingEvent.id) {
        await apiUpdateEvent(editingEvent.id, eventData);
        showToast('Event updated successfully', 'success');
      } else {
        await apiCreateEvent(eventData);
        showToast('Event created successfully', 'success');
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('localStorageUpdated'));
      await loadData(); // Reload all data
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        date: '',
        location: '',
        category: '',
        organizer: ''
      });
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error saving event:', error);
      showToast('Failed to save event. Please try again.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      date: '',
      location: '',
      category: '',
      organizer: ''
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleToggleFeatured = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) {
      try {
        await apiUpdateEvent(id, { featured: !event.featured });
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('localStorageUpdated'));
        await loadData(); // Reload all data
        showToast(`Event ${!event.featured ? 'marked as featured' : 'removed from featured'} successfully`, 'success');
      } catch (error) {
        console.error('Error toggling featured status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
        showToast(`Failed to update event: ${errorMessage}. Please try again.`, 'error');
      }
    }
  };

  const handleDeleteSubscriber = async (identifier: string) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        await apiDeleteSubscriber(identifier);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('localStorageUpdated'));
        await loadData(); // Reload all data
        showToast('Subscriber removed successfully', 'success');
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        showToast('Failed to remove subscriber. Please try again.', 'error');
      }
    }
  };

  const handleExportSubscribers = () => {
    // Convert subscribers to CSV format
    const headers = ['Email', 'Phone', 'Subscribed Date', 'Status'];
    const rows = subscribers.map(s => [
      s.email || 'N/A',
      s.phone || 'N/A',
      s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : 'N/A',
      s.status || 'active'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = bookings.filter(b => 
    b.status === 'Pending' || b.status?.toLowerCase() === 'pending'
  ).length;

  const normalizedUserSearch = userSearch.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    if (!normalizedUserSearch) return true;
    return (
      u.username.toLowerCase().includes(normalizedUserSearch) ||
      u.role.toLowerCase().includes(normalizedUserSearch) ||
      u.id.toLowerCase().includes(normalizedUserSearch)
    );
  });

  const bookingsByUserId = bookings.reduce((acc, booking) => {
    if (!booking.userId) return acc;
    if (!acc[booking.userId]) acc[booking.userId] = [];
    acc[booking.userId].push(booking);
    return acc;
  }, {} as Record<string, BookingWithEvent[]>);

  Object.values(bookingsByUserId).forEach((list) => {
    list.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || a.eventDate || 0).getTime();
      const bTime = new Date(b.createdAt || b.updatedAt || b.eventDate || 0).getTime();
      return bTime - aTime;
    });
  });

  const pageSize = 20;

  const bookingPageSize = pageSize;
  const bookingTotalPages = Math.max(1, Math.ceil(bookings.length / bookingPageSize));
  const bookingPageSafe = Math.min(bookingPage, bookingTotalPages);
  const bookingStartIndex = (bookingPageSafe - 1) * bookingPageSize;
  const bookingEndIndex = bookingStartIndex + bookingPageSize;
  const pagedBookings = bookings.slice(bookingStartIndex, bookingEndIndex);

  useEffect(() => {
    if (bookingPage !== bookingPageSafe) {
      setBookingPage(bookingPageSafe);
    }
  }, [bookingPage, bookingPageSafe]);

  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const userPageSafe = Math.min(userPage, userTotalPages);
  const userStartIndex = (userPageSafe - 1) * pageSize;
  const userEndIndex = userStartIndex + pageSize;
  const pagedUsers = filteredUsers.slice(userStartIndex, userEndIndex);

  useEffect(() => {
    if (userPage !== userPageSafe) {
      setUserPage(userPageSafe);
    }
  }, [userPage, userPageSafe]);

  useEffect(() => {
    setUserPage(1);
  }, [userSearch]);

  const eventTotalPages = Math.max(1, Math.ceil(events.length / pageSize));
  const eventPageSafe = Math.min(eventPage, eventTotalPages);
  const eventStartIndex = (eventPageSafe - 1) * pageSize;
  const eventEndIndex = eventStartIndex + pageSize;
  const pagedEvents = events.slice(eventStartIndex, eventEndIndex);

  useEffect(() => {
    if (eventPage !== eventPageSafe) {
      setEventPage(eventPageSafe);
    }
  }, [eventPage, eventPageSafe]);

  const subscriberTotalPages = Math.max(1, Math.ceil(subscribers.length / pageSize));
  const subscriberPageSafe = Math.min(subscriberPage, subscriberTotalPages);
  const subscriberStartIndex = (subscriberPageSafe - 1) * pageSize;
  const subscriberEndIndex = subscriberStartIndex + pageSize;
  const pagedSubscribers = subscribers.slice(subscriberStartIndex, subscriberEndIndex);

  useEffect(() => {
    if (subscriberPage !== subscriberPageSafe) {
      setSubscriberPage(subscriberPageSafe);
    }
  }, [subscriberPage, subscriberPageSafe]);

  const selectedUser = userBookingsModalId
    ? users.find((u) => u.id === userBookingsModalId)
    : null;
  const selectedUserBookings = selectedUser
    ? (bookingsByUserId[selectedUser.id] || [])
    : [];

  const sectionTabs = [
    { id: 'bookings', label: 'Booking Management', count: bookings.length },
    { id: 'users', label: 'User Management', count: filteredUsers.length },
    { id: 'events', label: 'Event Management', count: events.length },
    { id: 'subscribers', label: 'Subscription Management', count: subscribers.length }
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        )}

        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-xl md:rounded-2xl shadow-xl border border-purple-500/20 p-4 md:p-8 mb-4 md:mb-6">
          <FadeIn delay={0.2} duration={0.8}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
              <div className="flex-1">
                <AnimatedText delay={0.2} duration={0.8}>
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
                    Admin <span className="text-purple-200">Dashboard</span>
                  </h1>
                </AnimatedText>
                <p className="text-sm md:text-base text-purple-100">Manage bookings, events, and subscribers</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  if (onBack) onBack();
                }}
                className="w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm md:text-base rounded-xl hover:shadow-lg transition-all duration-200 font-semibold border border-white/30 hover:border-white/50 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
          <FadeIn delay={0.3} duration={0.6}>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 shadow-lg">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">{events.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.6}>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 shadow-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.5} duration={0.6}>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 shadow-lg">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">{subscribers.length}</div>
              <div className="text-sm text-gray-600">Subscribers</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.6} duration={0.6}>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 shadow-lg">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1 md:mb-2">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
          </FadeIn>
        </div>

        {/* Section Tabs */}
        <div className="mb-3 md:mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-2 md:p-3">
            <div className="flex flex-wrap gap-2">
              {sectionTabs.map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all border ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 text-[10px] md:text-xs rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Booking Management */}
        {activeSection === 'bookings' && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Booking Management</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="hidden md:block">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[18%]">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[20%]">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[8%]">Guests</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[12%]">Event Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[14%]">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[10%]">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[10%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No bookings found</td>
                    </tr>
                  ) : (
                    pagedBookings.map((booking) => {
                      const eventName = booking.eventName || 'Unknown Event';
                      return (
                          <tr key={booking.id} className="hover:bg-gray-50 align-top">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 break-words">{eventName}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 break-words">
                              <div className="font-medium text-gray-900">{booking.userName || 'N/A'}</div>
                              <div className="text-xs text-gray-600 break-all">{booking.userEmail || 'N/A'}</div>
                              <div className="text-xs text-gray-600">{booking.phone || 'N/A'}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{booking.guestCount ?? booking.tickets ?? 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 break-words">{booking.eventLocation || 'N/A'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === 'Approved' || booking.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                                booking.status === 'Rejected' || booking.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()) : 'Pending'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => {
                                  setDetailsBooking(booking);
                                  setAdminNote(booking.adminNote || '');
                                }}
                                className="px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            <div className="md:hidden">
              {bookings.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">No bookings found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pagedBookings.map((booking) => {
                      const eventName = (booking as any).eventName || 'Unknown Event';
                      return (
                        <div key={booking.id} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{eventName}</div>
                              <div className="text-xs text-gray-500 mt-1">{booking.userName || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{booking.userEmail || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Phone: {booking.phone || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Guests: {booking.guestCount ?? booking.tickets ?? 'N/A'}</div>
                              <div className="text-xs text-gray-500">
                                Event Date: {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500">Location: {booking.eventLocation || 'N/A'}</div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              booking.status === 'Approved' || booking.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                              booking.status === 'Rejected' || booking.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()) : 'Pending'}
                            </span>
                          </div>
                          <div className="mt-3">
                            <button
                              onClick={() => {
                                setDetailsBooking(booking);
                                setAdminNote(booking.adminNote || '');
                              }}
                              className="w-full sm:w-auto px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
            <div>
              Showing {pagedBookings.length} / {bookingPageSize} · Total {bookings.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBookingPage((p) => Math.max(1, p - 1))}
                disabled={bookingPageSafe === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500">
                Page {bookingPageSafe} / {bookingTotalPages}
              </span>
              <button
                onClick={() => setBookingPage((p) => Math.min(bookingTotalPages, p + 1))}
                disabled={bookingPageSafe === bookingTotalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        )}

        {/* User Management */}
        {activeSection === 'users' && (
          <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                User Management
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                  {filteredUsers.length}
                </span>
              </h2>
              <p className="text-gray-600 text-xs md:text-sm mt-1">View users and their booking history</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by username, role, or id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {userSearch && (
                <button
                  onClick={() => setUserSearch('')}
                  className="w-full sm:w-auto px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs md:text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="hidden md:block">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[26%]">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[14%]">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[14%]">Bookings</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[22%]">Last Booking</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[14%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No users found</td>
                    </tr>
                  ) : (
                    pagedUsers.map((u) => {
                      const userBookings = bookingsByUserId[u.id] || [];
                      const lastBooking = userBookings[0];
                      const lastBookingDateValue = lastBooking?.createdAt || lastBooking?.updatedAt || lastBooking?.eventDate;
                      const lastBookingDate = lastBookingDateValue ? new Date(lastBookingDateValue).toLocaleDateString() : 'N/A';
                      return (
                        <React.Fragment key={u.id}>
                          <tr className="hover:bg-gray-50 align-top">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="font-semibold">{u.username}</div>
                              <div className="text-xs text-gray-500">ID: {u.id}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{userBookings.length}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {lastBookingDate}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => setUserBookingsModalId(u.id)}
                                className="px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden">
              {filteredUsers.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">No users found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pagedUsers.map((u) => {
                    const userBookings = bookingsByUserId[u.id] || [];
                    const lastBooking = userBookings[0];
                    const lastBookingDateValue = lastBooking?.createdAt || lastBooking?.updatedAt || lastBooking?.eventDate;
                    const lastBookingDate = lastBookingDateValue ? new Date(lastBookingDateValue).toLocaleDateString() : 'N/A';
                    return (
                      <div key={u.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{u.username}</div>
                            <div className="text-xs text-gray-500">ID: {u.id}</div>
                            <div className="text-xs text-gray-500 mt-1">Role: {u.role}</div>
                            <div className="text-xs text-gray-500">Bookings: {userBookings.length}</div>
                            <div className="text-xs text-gray-500">
                              Last Booking: {lastBookingDate}
                            </div>
                          </div>
                          <button
                            onClick={() => setUserBookingsModalId(u.id)}
                            className="px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
            <div>
              Showing {pagedUsers.length} / {pageSize} · Total {filteredUsers.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                disabled={userPageSafe === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500">
                Page {userPageSafe} / {userTotalPages}
              </span>
              <button
                onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                disabled={userPageSafe === userTotalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Event Management */}
        {activeSection === 'events' && (
          <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Event Management</h2>
            {!editingEvent && (
              <button
                onClick={() => {
                  setEditingEvent({ id: '', title: '', description: '', price: 0, imageUrl: '', date: '', location: '', category: '', organizer: '' } as AdminEvent);
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs md:text-sm font-medium"
              >
                + Add Event
              </button>
            )}
          </div>

          {/* Add/Edit Event Form */}
          {editingEvent && (
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                {editingEvent.id ? 'Edit Event' : 'Add New Event'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Title *</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Organizer *</label>
                  <input
                    type="text"
                    value={eventForm.organizer}
                    onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Event organizer"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Date *</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Location *</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Event location"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Category *</label>
                  <input
                    type="text"
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Event category"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Price</label>
                  <input
                    type="number"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Event price"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Event Image</label>
                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-40 md:h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-purple-400 transition-colors">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-4">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Click to upload an image
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </span>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    )}
                    {!imagePreview && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Event description"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4 md:mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs md:text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="w-full sm:w-auto px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs md:text-sm font-medium"
                >
                  {editingEvent.id ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No events found</td>
                      </tr>
                    ) : (
                      pagedEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3 min-w-[200px]">
                              {event.imageUrl && (
                                <img src={event.imageUrl} alt={event.title || event.name || 'Event'} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 truncate">{event.title || event.name || 'Untitled Event'}</div>
                                {event.description && (
                                  <div className="text-xs text-gray-500 line-clamp-1 mt-1">{event.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {formatPriceInRupees(event.price)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{event.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{event.category}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                title="Edit event details"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleFeatured(event.id)}
                                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                  event.featured 
                                    ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
                                }`}
                                title={event.featured ? 'Remove from featured' : 'Mark as featured'}
                              >
                                {event.featured ? 'Featured' : 'Feature'}
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                title="Delete this event"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="md:hidden">
              {events.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">No events found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pagedEvents.map((event) => (
                    <div key={event.id} className="p-4">
                      <div className="flex items-center gap-3">
                        {event.imageUrl && (
                          <img src={event.imageUrl} alt={event.title || event.name || 'Event'} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 truncate">{event.title || event.name || 'Untitled Event'}</div>
                          {event.description && (
                            <div className="text-xs text-gray-500 line-clamp-2 mt-1">{event.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <div className="text-gray-500">Price</div>
                          <div className="font-semibold text-gray-900">{formatPriceInRupees(event.price)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Date</div>
                          <div className="font-semibold text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Location</div>
                          <div className="font-semibold text-gray-900">{event.location}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Category</div>
                          <div className="font-semibold text-gray-900">{event.category}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                          title="Edit event details"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(event.id)}
                          className={`w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            event.featured 
                              ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
                          }`}
                          title={event.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          {event.featured ? 'Featured' : 'Feature'}
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="w-full sm:w-auto px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Delete this event"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
            <div>
              Showing {pagedEvents.length} / {pageSize} · Total {events.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEventPage((p) => Math.max(1, p - 1))}
                disabled={eventPageSafe === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500">
                Page {eventPageSafe} / {eventTotalPages}
              </span>
              <button
                onClick={() => setEventPage((p) => Math.min(eventTotalPages, p + 1))}
                disabled={eventPageSafe === eventTotalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Subscriber Management */}
        {activeSection === 'subscribers' && (
          <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Subscription Management</h2>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Manage newsletter subscribers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={loadData}
                className="w-full sm:w-auto px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs md:text-sm font-medium flex items-center justify-center space-x-2"
                title="Refresh subscribers list"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExportSubscribers}
                className="w-full sm:w-auto px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm font-medium"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subscribed Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No subscribers found</td>
                      </tr>
                    ) : (
                      pagedSubscribers.map((subscriber, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{subscriber.email || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{subscriber.phone || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              subscriber.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {subscriber.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteSubscriber(subscriber.id || subscriber.email)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="md:hidden">
              {subscribers.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">No subscribers found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pagedSubscribers.map((subscriber, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{subscriber.email || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{subscriber.phone || 'N/A'}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Subscribed: {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                          subscriber.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscriber.status}
                        </span>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => handleDeleteSubscriber(subscriber.id || subscriber.email)}
                          className="w-full sm:w-auto px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
            <div>
              Showing {pagedSubscribers.length} / {pageSize} · Total {subscribers.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubscriberPage((p) => Math.max(1, p - 1))}
                disabled={subscriberPageSafe === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500">
                Page {subscriberPageSafe} / {subscriberTotalPages}
              </span>
              <button
                onClick={() => setSubscriberPage((p) => Math.min(subscriberTotalPages, p + 1))}
                disabled={subscriberPageSafe === subscriberTotalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setUserBookingsModalId(null)}
            />
            <div className="relative w-full max-w-[720px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">User Bookings</div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">{selectedUser.username}</h3>
                  <div className="text-xs text-gray-500">
                    ID: {selectedUser.id} | Role: {selectedUser.role} | Bookings: {selectedUserBookings.length}
                  </div>
                </div>
                <button
                  onClick={() => setUserBookingsModalId(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  aria-label="Close user bookings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-3">
                {selectedUserBookings.length === 0 ? (
                  <div className="text-sm text-gray-500">No bookings for this user.</div>
                ) : (
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {selectedUserBookings.map((booking) => {
                      const bookingDateValue = booking.eventDate || booking.createdAt || booking.updatedAt;
                      const bookingDate = bookingDateValue ? new Date(bookingDateValue).toLocaleDateString() : 'N/A';
                      return (
                        <div key={booking.id} className="flex items-start justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2 bg-white">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{booking.eventName || 'Unknown Event'}</div>
                            <div className="text-xs text-gray-500">
                              {bookingDate} | Guests: {booking.guestCount ?? booking.tickets ?? 'N/A'} | {booking.eventLocation || 'N/A'}
                            </div>
                            {booking.message && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                Message: {booking.message}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'Approved' || booking.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                              booking.status === 'Rejected' || booking.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()) : 'Pending'}
                            </span>
                            <button
                              onClick={() => {
                                setDetailsBooking(booking);
                                setAdminNote(booking.adminNote || '');
                                setUserBookingsModalId(null);
                              }}
                              className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {detailsBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setDetailsBooking(null);
                setAdminNote('');
              }}
            />
            <div className="relative w-full max-w-[720px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Booking Details</div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">{detailsBooking.eventName || 'Unknown Event'}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    detailsBooking.status === 'Approved' || detailsBooking.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                    detailsBooking.status === 'Rejected' || detailsBooking.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {detailsBooking.status ? (detailsBooking.status.charAt(0).toUpperCase() + detailsBooking.status.slice(1).toLowerCase()) : 'Pending'}
                  </span>
                  <button
                    onClick={() => {
                      setDetailsBooking(null);
                      setAdminNote('');
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    aria-label="Close details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-3">
                  <div className="rounded-lg border border-gray-200 p-2.5">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Event Date</div>
                        <div className="text-gray-900">{detailsBooking.eventDate ? new Date(detailsBooking.eventDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Location</div>
                        <div className="text-gray-900">{detailsBooking.eventLocation || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Guests</div>
                        <div className="text-gray-900">{detailsBooking.guestCount ?? detailsBooking.tickets ?? 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Phone</div>
                        <div className="text-gray-900">{detailsBooking.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Requested</div>
                        <div className="text-gray-900">{detailsBooking.createdAt ? new Date(detailsBooking.createdAt).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Status</div>
                        <div className="text-gray-900">{detailsBooking.status || 'Pending'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-2.5 space-y-2">
                    <div>
                      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Requester</div>
                      <div className="text-xs text-gray-900">{detailsBooking.userName || 'N/A'}</div>
                      <div className="text-xs text-gray-600 break-all">{detailsBooking.userEmail || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Message</div>
                      <div className="text-xs text-gray-700 break-words">{detailsBooking.message || '—'}</div>
                    </div>
                  </div>
                </div>

                {detailsBooking.adminNote && detailsBooking.status?.toLowerCase() !== 'pending' && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-2.5 mt-3">
                    <div className="text-[10px] font-semibold text-blue-900 uppercase tracking-wide mb-1">Admin Note</div>
                    <div className="text-xs text-blue-900">{detailsBooking.adminNote}</div>
                  </div>
                )}
              </div>

              {(detailsBooking.status === 'Pending' || detailsBooking.status?.toLowerCase() === 'pending') && (
                <div className="px-3 pb-3">
                  <div className="rounded-lg border border-gray-200 p-2.5">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Admin Note (Optional)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add a confirmation note for the customer..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={1}
                      />
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => handleApproveBooking(detailsBooking.id)}
                          disabled={actionLoading === detailsBooking.id}
                          className="bg-green-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                        >
                          {actionLoading === detailsBooking.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleRejectBooking(detailsBooking.id)}
                          disabled={actionLoading === detailsBooking.id}
                          className="bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                        >
                          {actionLoading === detailsBooking.id ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
