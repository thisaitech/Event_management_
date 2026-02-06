import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

