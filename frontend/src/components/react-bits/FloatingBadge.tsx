import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface FloatingBadgeProps {
  children: ReactNode;
  className?: string;
  floatDistance?: number;
  duration?: number;
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({ 
  children, 
  className = '',
  floatDistance = 8,
  duration = 3
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -floatDistance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};

