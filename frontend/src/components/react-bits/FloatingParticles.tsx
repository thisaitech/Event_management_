import { motion } from 'motion/react';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  color?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  count = 5,
  className = '',
  color = 'rgba(255, 255, 255, 0.1)'
}) => {
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 4,
            height: Math.random() * 6 + 4,
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, -60, -30, 0],
            x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.3, 0.5, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

