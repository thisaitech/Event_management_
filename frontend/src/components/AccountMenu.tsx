import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FadeIn } from './react-bits/FadeIn';

interface AccountMenuProps {
  onMyBookingsClick: () => void;
  onLogout?: () => void;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ onMyBookingsClick, onLogout }) => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      // Call the logout from context first
      await logout();
      // Then call the onLogout prop if provided (which shows login modal)
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and call onLogout
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all text-white backdrop-blur-sm"
      >
        <span className="text-xs md:text-sm font-medium truncate max-w-[60px] md:max-w-none">{user.username}</span>
        <svg
          className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <FadeIn delay={0} duration={0.2}>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[200]">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500 mt-1">
                {user.role === 'admin' ? 'Administrator' : user.role === 'organizer' ? 'Event Organizer' : 'User'}
              </p>
            </div>

            <div className="py-2">
              <button
                onClick={() => {
                  onMyBookingsClick();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>My Bookings</span>
              </button>


              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
              >
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

export default AccountMenu;

