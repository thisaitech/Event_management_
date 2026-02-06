import React, { InputHTMLAttributes, useState } from 'react';
import { motion } from 'motion/react';

interface WaveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  waveColor?: string;
}

export const WaveInput: React.FC<WaveInputProps> = ({ 
  waveColor = '#6366f1',
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="relative flex-1 w-full min-w-0">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: isFocused ? 1 : 0,
          backgroundColor: waveColor
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />
      <input
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
      />
      {isFocused && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          style={{ backgroundColor: waveColor }}
          initial={{ width: 0 }}
          animate={{ 
            width: '100%',
            boxShadow: `0 0 10px ${waveColor}, 0 0 20px ${waveColor}40`
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      )}
    </div>
  );
};
