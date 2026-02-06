
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AccountMenu from './AccountMenu';
import { AnimatedText } from './react-bits/AnimatedText';
import { FadeIn } from './react-bits/FadeIn';
import { MagneticButton } from './react-bits/MagneticButton';
import { WaveInput } from './react-bits/WaveInput';
import { ShimmerButton } from './react-bits/ShimmerButton';
import { FloatingBadge } from './react-bits/FloatingBadge';
import { BlurFade } from './react-bits/BlurFade';
import { FloatingParticles } from './react-bits/FloatingParticles';
import { PulseRing } from './react-bits/PulseRing';

interface HeroProps {
  onSearch: (query: string, category: string, searchParams?: {location?: string; date?: string}) => void;
  showContent?: boolean;
  onLoginClick?: () => void;
  user?: { id: string; username: string; role: string } | null;
  onLogout?: () => void;
  onMyBookingsClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch, showContent = true, onLoginClick, user, onLogout, onMyBookingsClick }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [query, setQuery] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  useEffect(() => {
    if (!showContent) return;
    
    const handleScroll = () => {
      if (backgroundRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3; // Very slow parallax
        backgroundRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showContent]);

  const handleExploreClick = () => {
    const resultsSection = document.getElementById('events-grid');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, '');
    // Scroll to results
    const resultsSection = document.getElementById('events-grid');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrowseClick = () => {
    const resultsSection = document.getElementById('events-grid');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Black background base */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Background Image with Parallax - Instant appearance when video ends */}
      {showContent && (
        <div 
          ref={backgroundRef}
          className="absolute inset-0 overflow-hidden"
      style={{
            willChange: 'transform',
            transition: 'transform 0.1s ease-out',
            opacity: 1
          }}
        >
          <img
            src="/hero-background.png"
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%',
              transition: 'none',
              animation: 'none'
      }}
          />
          {/* Floating Particles Background Effect */}
          <FloatingParticles count={8} color="rgba(255, 255, 255, 0.08)" />
        </div>
      )}

      {/* Header Navigation */}
      <FadeIn delay={0.2} duration={0.6}>
        <header className="relative z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between bg-white/10 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-white/10 md:border-none">
            {/* Logo - Top Left */}
          <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/90 md:bg-white rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
              <span className="text-xl font-semibold tracking-tight text-white">Eventic</span>
          </div>
          
                {/* Right Side Actions - Top Right */}
          <div className="flex items-center space-x-3">
                  {!user && (
                    <a
                      href="tel:+911234567890"
                      className="text-sm font-medium text-white bg-purple-400/20 hover:bg-purple-400/30 border border-purple-300/30 hover:border-purple-300/50 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call Now</span>
                    </a>
                  )}
                  {user ? (
                    <AccountMenu 
                      onMyBookingsClick={onMyBookingsClick || (() => {})}
                      onLogout={onLogout}
                    />
                  ) : (
                    <button 
                      onClick={onLoginClick}
                      className="text-sm font-medium text-white bg-purple-400/20 hover:bg-purple-400/30 border border-purple-300/30 hover:border-purple-300/50 px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      Sign In
                    </button>
                  )}
          </div>
        </div>
      </header>
      </FadeIn>

      {/* Main Hero Content */}
      {showContent && (
        <FadeIn delay={0.1} duration={0.8}>
          <div className="flex-grow flex flex-col justify-center relative z-10 py-4 md:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                {/* Left Side - Hero Text Content - Hidden on mobile */}
                <div className="hidden lg:flex flex-col justify-start w-full space-y-8">
                  {/* Headline with AnimatedText and BlurFade */}
                  <BlurFade delay={0.2} duration={0.8} blurAmount={8}>
                    <AnimatedText delay={0.2} duration={0.8}>
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
                        Book Your Premium <span className="text-purple-400">Event Management</span>
                      </h1>
                    </AnimatedText>
                  </BlurFade>

                  {/* Secondary CTA */}
                  <AnimatedText delay={0.8} duration={0.8}>
                    <div className="flex justify-start">
                      <button 
                        onClick={handleBrowseClick}
                        className="text-white border border-white/30 hover:border-white/50 bg-white/10 backdrop-blur-md hover:bg-white/15 font-medium px-8 py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-white/5"
                      >
                        Browse Premium Events
                      </button>
                    </div>
                  </AnimatedText>
                </div>

                {/* Right Side - Search Bar - Full width on mobile with better mobile styling */}
                <div className="flex flex-col justify-center w-full">
                  {/* Mobile-only headline */}
                  <div className="lg:hidden mb-6 space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                      Book Your Premium <span className="text-purple-400">Event</span>
                    </h1>
                    <p className="text-base sm:text-lg text-white/80 font-medium">Professional event management services</p>
                  </div>

                  <AnimatedText delay={0.6} duration={0.8}>
                    <form onSubmit={handleSearch} className="w-full">
                      <div className="flex flex-col gap-4 bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-gray-100">
                        {/* What - Event Type with popular event buttons */}
                        <div className="space-y-3">
                          <label className="block text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">What Event?</label>
                          <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 px-4 py-3 transition-all">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <WaveInput
                              type="text" 
                              placeholder="Wedding, Corporate, Conference..."
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
                              waveColor="#a855f7"
                            />
                          </div>
                          {/* Popular Event Types Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {['Wedding', 'Corporate', 'Conference', 'Festival', 'Gala'].map((eventType) => (
                              <button 
                                key={eventType}
                                type="button"
                                onClick={() => setQuery(eventType)}
                                className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 hover:border-purple-300 transition-all"
                              >
                                {eventType}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Where - Location */}
                        <div className="space-y-3">
                          <label className="block text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">Where?</label>
                          <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 px-4 py-3 transition-all">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <select
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="flex-1 bg-transparent border-none outline-none text-gray-900 text-sm font-medium appearance-none cursor-pointer focus:outline-none"
                            >
                              <option value="">Select Location (Tamil Nadu)</option>
                              <option value="Chennai">Chennai</option>
                              <option value="Coimbatore">Coimbatore</option>
                              <option value="Madurai">Madurai</option>
                              <option value="Tiruchirappalli">Tiruchirappalli</option>
                              <option value="Salem">Salem</option>
                              <option value="Tirunelveli">Tirunelveli</option>
                              <option value="Erode">Erode</option>
                              <option value="Vellore">Vellore</option>
                              <option value="Thoothukudi">Thoothukudi</option>
                              <option value="Dindigul">Dindigul</option>
                              <option value="Thanjavur">Thanjavur</option>
                              <option value="Ranipet">Ranipet</option>
                              <option value="Sivakasi">Sivakasi</option>
                              <option value="Karur">Karur</option>
                              <option value="Udhagamandalam (Ooty)">Udhagamandalam (Ooty)</option>
                              <option value="Hosur">Hosur</option>
                              <option value="Nagercoil">Nagercoil</option>
                              <option value="Kanchipuram">Kanchipuram</option>
                              <option value="Kumarapalayam">Kumarapalayam</option>
                              <option value="Karaikudi">Karaikudi</option>
                            </select>
                            <svg className="w-5 h-5 text-gray-400 ml-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* When - Date */}
                        <div className="space-y-3">
                          <label className="block text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">When?</label>
                          <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 px-4 py-3 transition-all">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <WaveInput
                              type="date"
                              placeholder="Event date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
                              waveColor="#a855f7"
                            />
                          </div>
                        </div>
                        
                        {/* Search & Book Button */}
                        <div className="w-full pt-2">
                          <MagneticButton 
                            onClick={() => {}}
                            strength={0.2}
                              className="relative w-full"
                          >
                            <ShimmerButton
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                // Check if user is logged in
                                if (!isAuthenticated) {
                                  // Show login modal if not authenticated
                                  if (onLoginClick) {
                                    onLoginClick();
                                  }
                                  return;
                                }
                                // Pass search params to onSearch which will redirect to booking page
                                onSearch(query, '', {
                                  location: location,
                                  date: date
                                });
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-base lg:text-sm px-6 py-3 rounded-xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all"
                            >
                              Book Your Event Now
                            </ShimmerButton>
                          </MagneticButton>
                        </div>
                      </div>
                    </form>
                  </AnimatedText>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

export default Hero;
