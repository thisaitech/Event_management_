import React, { useState } from 'react';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { WaveInput } from './react-bits/WaveInput';
import { ShimmerButton } from './react-bits/ShimmerButton';
import { MagneticButton } from './react-bits/MagneticButton';
import { FadeIn } from './react-bits/FadeIn';

interface BookingModalProps {
  event: Event | null;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ event, onClose, onBookingSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [userName, setUserName] = useState(user?.username || '');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(50);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !phone || !guestCount) {
      showToast('Please fill in all required fields (Name, Phone, Guest Count)', 'warning');
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      showToast('Please enter a valid 10-digit phone number', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // Use storage utility for booking creation
      const { createBooking } = await import('../../utils/storage');
      
      const data = await createBooking({
        eventId: event.id,
        userName,
        userEmail: userEmail || undefined,
        phone: phone,
        guestCount: parseInt(guestCount.toString()),
        message: message || undefined,
        userId: user?.id || undefined,
      });
      
      setBookingSuccess(true);
      onBookingSuccess?.();
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Booking failed';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <FadeIn delay={0.1} duration={0.3}>
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full text-gray-600 transition-colors"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
            {/* Event Info */}
            <div className="relative h-64 md:h-auto">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="bg-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">
                  {event.category}
                </span>
                <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                <p className="text-sm text-white/90 line-clamp-2">{event.description}</p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="p-6 md:p-8">
              {bookingSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Requested!</h3>
                  <p className="text-gray-600">Awaiting admin approval. You'll receive a confirmation email shortly.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Event Date</p>
                        <p className="font-semibold text-gray-900">{event.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
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
          
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
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
              
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                      <WaveInput
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Enter your email (optional)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        waveColor="#9333ea"
                      />
              </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected Guest Count</label>
                      <WaveInput
                        type="number"
                        min="1"
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        waveColor="#9333ea"
                        required
                      />
                </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements or Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about any special requirements for your event (optional)"
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                      />
                </div>

                    <div className="pt-4">
                      <MagneticButton strength={0.2} className="w-full">
                        <ShimmerButton
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold px-6 py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Submitting Request...' : 'Submit Booking Request'}
                        </ShimmerButton>
                      </MagneticButton>
                      <p className="text-center text-xs text-gray-400 mt-4">
                        Your request will be reviewed and we'll contact you shortly.
                      </p>
              </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default BookingModal;
