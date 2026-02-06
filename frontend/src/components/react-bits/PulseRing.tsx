import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PulseRingProps {
  children: ReactNode;
  className?: string;
  ringColor?: string;
  size?: number;
}

export const PulseRing: React.FC<PulseRingProps> = ({ 
  children, 
  className = '',
  ringColor = 'rgba(99, 102, 241, 0.4)',
  size = 120
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: ringColor,
          width: size,
          height: size,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
        animate={{
          scale: [1, 1.5, 1.8],
          opacity: [0.6, 0.3, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: ringColor,
          width: size,
          height: size,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
        animate={{
          scale: [1, 1.3, 1.6],
          opacity: [0.4, 0.2, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
          ease: 'easeOut'
        }}
      />
    </div>
  );
};

