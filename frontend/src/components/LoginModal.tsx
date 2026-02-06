import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FadeIn } from './react-bits/FadeIn';
import { AnimatedText } from './react-bits/AnimatedText';
import { WaveInput } from './react-bits/WaveInput';
import { ShimmerButton } from './react-bits/ShimmerButton';
import { MagneticButton } from './react-bits/MagneticButton';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username.trim(), password.trim());
      if (success) {
        onLoginSuccess?.();
        onClose();
      }
      // Error is already handled in AuthContext with alert
    } catch (error) {
      console.error('Login form error:', error);
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType: 'user' | 'admin') => {
    if (userType === 'user') {
      setUsername('user1');
      setPassword('pass123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <FadeIn delay={0.1} duration={0.3}>
        <div className="bg-white w-full max-w-md rounded-xl md:rounded-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-20 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 md:p-8">
            <AnimatedText delay={0.2} duration={0.6}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600 text-sm mb-6 md:mb-8">Welcome back to Eventic</p>
            </AnimatedText>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <WaveInput
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm md:text-base"
                  waveColor="#9333ea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <WaveInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm md:text-base"
                  waveColor="#9333ea"
                  required
                />
              </div>

              <MagneticButton strength={0.2}>
                <ShimmerButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold px-6 py-2.5 md:py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </ShimmerButton>
              </MagneticButton>
            </form>

            <div className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials (Click to fill):</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('user')}
                  className="w-full text-left px-3 py-2 text-xs md:text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <span className="font-semibold">User:</span> user1 / pass123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full text-left px-3 py-2 text-xs md:text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <span className="font-semibold">Admin:</span> admin / admin123
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default LoginModal;
