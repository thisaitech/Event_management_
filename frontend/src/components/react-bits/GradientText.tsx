import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: string[];
  animate?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className = '',
  gradient = ['#6366f1', '#8b5cf6', '#ec4899'],
  animate = true
}) => {
  const gradientString = `linear-gradient(90deg, ${gradient.join(', ')})`;
  
  return (
    <motion.span
      className={className}
      style={{
        background: gradientString,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : {}}
      transition={animate ? {
        duration: 5,
        repeat: Infinity,
        ease: 'linear'
      } : {}}
    >
      {children}
    </motion.span>
  );
};

