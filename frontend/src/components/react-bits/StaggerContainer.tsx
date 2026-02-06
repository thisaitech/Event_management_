import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  delay = 0
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

