import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { WaveInput } from '../react-bits/WaveInput';
import { ShimmerButton } from '../react-bits/ShimmerButton';
import { MagneticButton } from '../react-bits/MagneticButton';
import { FadeIn } from '../react-bits/FadeIn';
import { AnimatedText } from '../react-bits/AnimatedText';
import { getEvents, Event } from '@/utils/storage';
import { formatPriceInRupees } from '@/utils/currency';

interface BookingPageProps {
  searchParams?: {
    eventType?: string;
    location?: string;
    date?: string;
  };
  onBookingSuccess?: () => void;
  onBack?: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ searchParams = {}, onBookingSuccess, onBack }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userName, setUserName] = useState(user?.username || '');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(50);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        const fetchedEvents = await getEvents();
        if (!isActive) return;
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

        // Auto-select event if search params match
        if (searchParams.eventType || searchParams.location || searchParams.date) {
          const matchedEvent = convertedEvents.find(e => 
            (!searchParams.eventType || e.category.toLowerCase().includes(searchParams.eventType.toLowerCase()) || e.title.toLowerCase().includes(searchParams.eventType.toLowerCase())) &&
            (!searchParams.location || e.location.toLowerCase().includes(searchParams.location.toLowerCase())) &&
            (!searchParams.date || e.date === searchParams.date)
          );
          if (matchedEvent) {
            setSelectedEvent(matchedEvent);
          }
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        if (isActive) {
          setEventsLoading(false);
        }
      }
    };

    loadEvents();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eventic_events' || e.key === null) {
        loadEvents();
      }
    };

    const handleCustomStorageEvent = () => {
      loadEvents();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomStorageEvent);

    return () => {
      isActive = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageEvent);
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent) {
      showToast('Please select an event to book', 'warning');
      return;
    }

    if (!userName.trim() || !phone.trim() || !guestCount) {
      showToast('Please fill in all required fields (Name, Phone, Guest Count)', 'warning');
      return;
    }

    // Validate phone number (basic validation - 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      showToast('Please enter a valid 10-digit phone number', 'warning');
      return;
    }

    // Validate email only if provided
    if (userEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail.trim())) {
        showToast('Please enter a valid email address', 'warning');
        return;
      }
    }

    setIsLoading(true);
    try {
      const { createBooking } = await import('../../utils/storage');
      
      await createBooking({
        eventId: selectedEvent.id,
        userName: userName.trim(),
        userEmail: userEmail.trim() || undefined,
        phone: phone.trim(),
        guestCount: parseInt(guestCount.toString()),
        message: message.trim() || undefined,
        userId: user?.id || undefined,
      });
      
      // Trigger success callback which will show toast and redirect
      onBookingSuccess?.();
    } catch (error) {
      console.error('Booking submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Booking failed';
      showToast(`Booking failed: ${errorMessage}`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
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

        <FadeIn delay={0.2} duration={0.8}>
          <div className="mb-8">
            <AnimatedText delay={0.2} duration={0.8}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Book Your <span className="text-purple-600">Event</span>
              </h1>
            </AnimatedText>
            <AnimatedText delay={0.4} duration={0.8}>
              <p className="text-base text-gray-600">
                Complete the form below to request booking for your event
              </p>
            </AnimatedText>
          </div>
        </FadeIn>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Event Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Select Event *</label>
              {eventsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No events available</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedEvent?.id === event.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{event.location}</div>
                      <div className="text-sm text-purple-600 font-medium mt-1">{formatPriceInRupees(event.price)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedEvent && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-purple-900">Selected: {selectedEvent.title}</span>
                </div>
                <p className="text-sm text-gray-700">{selectedEvent.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                <WaveInput
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  waveColor="#9333ea"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                <WaveInput
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your 10-digit phone number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  waveColor="#9333ea"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address (Optional)</label>
                <WaveInput
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email (optional)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  waveColor="#9333ea"
                />
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Guests *</label>
                <WaveInput
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="Enter number of guests"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  waveColor="#9333ea"
                  required
                />
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Additional Requirements or Special Requests
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about any special requirements for your event (optional)"
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                onClick={(e) => {
                  // Prevent submission if no event selected (additional validation)
                  if (!selectedEvent) {
                    e.preventDefault();
                    showToast('Please select an event to book', 'warning');
                    return false;
                  }
                }}
                disabled={isLoading || !selectedEvent}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold px-8 py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-base relative overflow-hidden transition-all"
              >
                {isLoading ? 'Submitting Request...' : 'Submit Booking Request'}
              </button>
              {!selectedEvent && (
                <p className="text-center text-sm text-red-500 mt-2">
                  Please select an event to continue
                </p>
              )}
              <p className="text-center text-sm text-gray-500 mt-4">
                Your request will be reviewed and you'll receive a confirmation shortly.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
