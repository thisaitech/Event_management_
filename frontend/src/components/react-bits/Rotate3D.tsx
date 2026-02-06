import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface Rotate3DProps {
  children: ReactNode;
  className?: string;
  rotateX?: number;
  rotateY?: number;
  perspective?: number;
}

export const Rotate3D: React.FC<Rotate3DProps> = ({ 
  children, 
  className = '',
  rotateX = 0,
  rotateY = 0,
  perspective = 1000
}) => {
  return (
    <motion.div
      className={className}
      style={{ perspective }}
      whileHover={{
        rotateX,
        rotateY,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

