import React, { useState } from 'react';
import { FadeIn } from '../react-bits/FadeIn';
import { AnimatedText } from '../react-bits/AnimatedText';
import { ShimmerButton } from '../react-bits/ShimmerButton';
import { MagneticButton } from '../react-bits/MagneticButton';
import { WaveInput } from '../react-bits/WaveInput';
import { addSubscriber as apiAddSubscriber } from '@/utils/storage';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const normalizePhone = (value: string): string => value.replace(/[^\d]/g, '');

  const validatePhone = (value: string): boolean => {
    const digits = normalizePhone(value);
    return digits.length >= 10 && digits.length <= 15;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail && !trimmedPhone) {
      setMessage({ type: 'error', text: 'Please enter an email or mobile number' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (trimmedPhone && !validatePhone(trimmedPhone)) {
      setMessage({ type: 'error', text: 'Please enter a valid mobile number' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setIsLoading(true);
    try {
      // Use API to add subscriber
      await apiAddSubscriber(trimmedEmail, trimmedPhone);
      setMessage({ type: 'success', text: 'Successfully subscribed! Thank you.' });
      setEmail('');
      setPhone('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription failed';
      console.error('Newsletter subscription error:', error);
      
      // Provide user-friendly error messages
      let displayMessage = 'Subscription failed. Please try again.';
      if (errorMessage.includes('Email already subscribed')) {
        displayMessage = 'This email is already subscribed';
      } else if (errorMessage.includes('Phone already subscribed')) {
        displayMessage = 'This mobile number is already subscribed';
      } else if (errorMessage.includes('already subscribed') || errorMessage.includes('409')) {
        displayMessage = 'This contact is already subscribed';
      } else if (errorMessage.includes('Cannot connect to server') || errorMessage.includes('Failed to fetch')) {
        displayMessage = 'Unable to connect to server. Please check your connection and ensure the backend is running.';
      } else if (errorMessage.includes('400') || errorMessage.includes('Email is required') || errorMessage.includes('Email or phone is required')) {
        displayMessage = 'Please enter a valid email or mobile number';
      }
      
      setMessage({ 
        type: 'error', 
        text: displayMessage
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const patternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <section className="py-10 md:py-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url("${patternUrl}")` }}
      ></div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <FadeIn delay={0.2} duration={0.8}>
          <div className="text-center">
            <AnimatedText delay={0.2} duration={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Stay Updated
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.4} duration={0.8}>
              <p className="text-base text-purple-100 mb-6 max-w-xl mx-auto">
                Get notified about new events, exclusive deals, and special offers
              </p>
            </AnimatedText>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <WaveInput
                  type="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/95 backdrop-blur-sm rounded-lg px-5 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none"
                  waveColor="#a855f7"
                />
                <WaveInput
                  type="tel"
                  placeholder="Mobile number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/95 backdrop-blur-sm rounded-lg px-5 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none"
                  waveColor="#a855f7"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <MagneticButton strength={0.2}>
                  <ShimmerButton
                    type="submit"
                    disabled={isLoading}
                    className="bg-white text-purple-600 font-bold px-8 py-3.5 rounded-lg hover:bg-gray-50 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </ShimmerButton>
                </MagneticButton>
              </div>
              {message && (
                <div className={`mt-4 text-center text-sm font-medium ${
                  message.type === 'success' ? 'text-green-200' : 'text-red-200'
                }`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Newsletter;
