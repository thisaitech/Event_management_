
import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Import components from the components folder
import Hero from './components/Hero';
import EventDetailModal from './components/EventDetailModal';
import LoginModal from './components/LoginModal';
import MyBookings from './components/pages/MyBookings';
import BookingPage from './components/pages/BookingPage';
import AdminPanel from './components/pages/AdminPanel';
import AIAssistant from './components/AIAssistant';
import { ToastProvider, useToast } from './contexts/ToastContext';
import VideoIntro from './components/VideoIntro';
import FeaturedEvents from './components/sections/FeaturedEvents';
import Categories from './components/sections/Categories';
import HowItWorks from './components/sections/HowItWorks';
import Testimonials from './components/sections/Testimonials';
import Newsletter from './components/sections/Newsletter';
import EnhancedFooter from './components/sections/EnhancedFooter';
import { Event } from './types';
import { getEvents } from './utils/storage';

const AppContent: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Show login modal when user logs out
  const handleLogout = async () => {
    await logout();
    setShowLoginModal(true);
  };
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showBookingPage, setShowBookingPage] = useState(false);
  const [bookingSearchParams, setBookingSearchParams] = useState<{eventType?: string; location?: string; date?: string}>({});
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Fetch events from backend API on mount
  React.useEffect(() => {
    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError(null);
        const fetchedEvents = await getEvents();
        // Convert API events to app format (ensuring category is properly typed)
        const convertedEvents: Event[] = fetchedEvents.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description || '',
          date: e.date,
          location: e.location,
          category: e.category as any,
          price: e.price || 0,
          imageUrl: e.imageUrl || 'https://picsum.photos/800/600',
          organizer: e.organizer
        }));
        setEvents(convertedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        // Provide user-friendly error message
        let errorMessage = 'Failed to load events';
        if (error instanceof Error) {
          // Handle JSON parsing errors more gracefully
          if (error.message.includes('Unexpected token') || error.message.includes('JSON')) {
            errorMessage = 'Data format error. Please refresh the page.';
          } else {
            errorMessage = error.message;
          }
        }
        setEventsError(errorMessage);
        // Set empty array on error to prevent crashes - use demo data instead
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();

    // Listen for storage changes to keep events in sync
    const handleStorageChange = (e: StorageEvent) => {
      // Reload events when localStorage changes
      if (e.key === 'eventic_events' || e.key === null) {
        loadEvents();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageEvent = () => {
      loadEvents();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageEvent);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
      return matchesQuery && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const handleSearch = (query: string, category: string, searchParams?: {location?: string; date?: string}) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    
    // If search params provided, redirect to booking page
    if (searchParams) {
      setBookingSearchParams({
        eventType: query,
        location: searchParams.location,
        date: searchParams.date
      });
      setShowBookingPage(true);
    } else {
      // Smooth scroll to results
      const resultsSection = document.getElementById('events-grid');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBookingSuccess = () => {
    showToast('Booking request submitted! Waiting for admin confirmation...', 'info');
    setShowBookingPage(false);
    // Redirect to My Bookings after a short delay
    setTimeout(() => {
      if (user) {
        setShowMyBookings(true);
      }
    }, 3000);
  };

  // If admin is logged in, show admin panel as main page
  if (isAdmin && user) {
    return (
      <>
        <AdminPanel onLogout={handleLogout} />
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => {
              setShowLoginModal(false);
            }}
          />
        )}
      </>
    );
  }

  // Booking Page
  if (showBookingPage) {
    return (
      <>
        <BookingPage 
          searchParams={bookingSearchParams}
          onBookingSuccess={handleBookingSuccess}
          onBack={() => setShowBookingPage(false)}
        />
      </>
    );
  }

  // Regular user pages
  if (showMyBookings && user && !isAdmin) {
    return <MyBookings onBack={() => setShowMyBookings(false)} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      showVideoIntro ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Hero background always visible for smooth transition */}
      <Hero 
        onSearch={handleSearch} 
        showContent={!showVideoIntro}
        onLoginClick={() => setShowLoginModal(true)}
        user={user}
        onLogout={logout}
        onMyBookingsClick={() => setShowMyBookings(true)}
      />
      
      {showVideoIntro && (
        <VideoIntro onVideoEnd={() => setShowVideoIntro(false)} />
      )}
      
      <div className={`transition-opacity duration-300 ${showVideoIntro ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <main className="flex-grow">
          {/* Featured Events Gallery */}
          {eventsLoading ? (
            <div className="py-16 text-center">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : eventsError ? (
            <div className="py-16 text-center">
              <p className="text-red-600">Error: {eventsError}</p>
              <p className="text-gray-500 text-sm mt-2">Please refresh the page or check your connection.</p>
            </div>
          ) : (
            <FeaturedEvents 
              events={events} 
              onEventClick={setSelectedEvent}
            />
          )}

          {/* Categories Section */}
          <Categories />

          {/* How It Works Section */}
          <HowItWorks />

          {/* Testimonials Section */}
          <Testimonials />

          {/* Newsletter Section */}
          <Newsletter />
      </main>

        {/* Enhanced Footer */}
        <EnhancedFooter />

      <EventDetailModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)}
      />
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
          }}
        />
      )}

      
      <AIAssistant />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
