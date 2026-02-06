import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FadeIn } from '../react-bits/FadeIn';
import { AnimatedText } from '../react-bits/AnimatedText';
import { StaggerContainer } from '../react-bits/StaggerContainer';
import { StaggerItem } from '../react-bits/StaggerItem';

interface Booking {
  id: string;
  userId: string;
  eventId: string;
  eventName: string;
  userName: string;
  userEmail: string;
  guestCount?: number;
  tickets?: number; // Keep for backward compatibility
  phone?: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  adminNote: string | null;
  updatedAt?: string;
}

interface MyBookingsProps {
  onBack?: () => void;
}

const MyBookings: React.FC<MyBookingsProps> = ({ onBack }) => {
  const { user, token, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();

    // Listen for storage changes to keep data in sync
    const handleStorageChange = (e: StorageEvent) => {
      // Reload bookings when localStorage changes
      if (e.key === 'eventic_bookings' || e.key === 'eventic_events' || e.key === null) {
        fetchBookings();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageEvent = () => {
      fetchBookings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageEvent);
    };
  }, [user, token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Use storage utility instead of direct fetch
      const { getBookings } = await import('../../utils/storage');
      // Admin sees all bookings, users see only their own
      const userId = isAdmin ? undefined : user?.id;
      
      const data = await getBookings(userId);
      // Convert storage format to component format
      const convertedBookings: Booking[] = await Promise.all(data.map(async (b) => {
        // Fetch event details to get eventName
        const { getEvents } = await import('../../utils/storage');
        const events = await getEvents();
        const event = events.find(e => e.id === b.eventId);
        
        return {
          id: b.id,
          userId: b.userId || '',
          eventId: b.eventId,
          eventName: event?.title || 'Unknown Event',
          userName: b.userName,
          userEmail: b.userEmail,
          guestCount: b.guestCount,
          phone: b.phone,
          message: b.message,
          status: (b.status.charAt(0).toUpperCase() + b.status.slice(1)) as 'Pending' | 'Approved' | 'Rejected',
          createdAt: b.createdAt,
          adminNote: b.adminNote || null,
          updatedAt: b.updatedAt,
        };
      }));
      setBookings(convertedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Failed to load bookings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: 'Approved' | 'Rejected') => {
    setActionLoading(bookingId);
    try {
      // Use storage utility instead of direct fetch
      const { updateBooking } = await import('../../utils/storage');
      
      await updateBooking(bookingId, {
        status,
        adminNote: adminNote || undefined,
      });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('localStorageUpdated'));
      
      await fetchBookings();
      setEditingBooking(null);
      setAdminNote('');
      showToast(`Booking ${status.toLowerCase()} successfully`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update booking';
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-5 text-sm text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        )}
        <FadeIn delay={0.2} duration={0.8}>
          <div className="mb-4">
            <AnimatedText delay={0.2} duration={0.8}>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {isAdmin ? 'All Bookings' : 'My Bookings'}
              </h1>
            </AnimatedText>
            <AnimatedText delay={0.4} duration={0.8}>
              <p className="text-xs sm:text-sm text-gray-600">
                {isAdmin ? 'Manage and review all event bookings' : 'Track your event bookings and their status'}
              </p>
            </AnimatedText>
          </div>
        </FadeIn>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-6 sm:p-8 text-center border border-gray-200 shadow-sm">
            <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 text-xs sm:text-sm">No bookings found.</p>
          </div>
        ) : (
          <StaggerContainer delay={0.6} staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookings.map((booking) => (
                <StaggerItem key={booking.id}>
                  <div className="h-full bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col gap-3">
                      {/* Header */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                              {booking.eventName}
                            </h3>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border whitespace-nowrap ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        {isAdmin && (
                          <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5">
                            <span className="font-medium text-gray-900">{booking.userName}</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-gray-700">{booking.userEmail}</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-600 text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-600">Guests</p>
                            <p className="text-[11px] font-semibold text-gray-900">{booking.guestCount || booking.tickets || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-600">Request Date</p>
                            <p className="text-[11px] font-semibold text-gray-900">
                              {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {booking.phone && (
                          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-600">Phone</p>
                              <p className="text-[11px] font-semibold text-gray-900">{booking.phone}</p>
                            </div>
                          </div>
                        )}

                        {booking.updatedAt && booking.status !== 'Pending' && (
                          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-600 text-white">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-600">Updated</p>
                              <p className="text-[11px] font-semibold text-gray-900">
                                {new Date(booking.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Requirements */}
                      {booking.message && (
                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-600 mb-1">Requirements</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{booking.message}</p>
                        </div>
                      )}

                      {/* Admin Note */}
                      {(!isAdmin || booking.adminNote) && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-900 mb-1">Admin Note</p>
                          {booking.adminNote ? (
                            <p className="text-xs text-blue-900 leading-relaxed font-medium">{booking.adminNote}</p>
                          ) : (
                            <p className="text-xs text-blue-700 italic">No admin note yet.</p>
                          )}
                          {booking.updatedAt && booking.adminNote && (
                            <p className="text-[11px] text-blue-700 mt-1">
                              Updated: {new Date(booking.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Pending Status Alert */}
                      {booking.status === 'Pending' && !isAdmin && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                          Awaiting admin confirmation
                        </div>
                      )}

                      {/* Admin Review Form */}
                      {isAdmin && booking.status === 'Pending' && editingBooking === booking.id && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1 uppercase tracking-wide">Admin Note (Optional)</label>
                          <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Add a confirmation note for the customer..."
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
                            rows={2}
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'Approved')}
                              disabled={actionLoading === booking.id}
                              className="flex-1 bg-green-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                            >
                              {actionLoading === booking.id ? 'Processing...' : 'Approve Booking'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                              disabled={actionLoading === booking.id}
                              className="flex-1 bg-red-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                            >
                              {actionLoading === booking.id ? 'Processing...' : 'Reject Booking'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingBooking(null);
                                setAdminNote('');
                              }}
                              className="sm:flex-none px-3 py-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Review Button for Admin */}
                      {isAdmin && booking.status === 'Pending' && editingBooking !== booking.id && (
                        <button
                          onClick={() => setEditingBooking(booking.id)}
                          className="w-full sm:w-auto sm:self-end px-3 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-xs"
                        >
                          Review Booking
                        </button>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

