import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  blurAmount?: number;
}

export const BlurFade: React.FC<BlurFadeProps> = ({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.8,
  blurAmount = 10
}) => {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        filter: `blur(${blurAmount}px)` 
      }}
      animate={{ 
        opacity: 1, 
        filter: 'blur(0px)' 
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

