import { motion } from 'framer-motion';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ShimmerText: React.FC<ShimmerTextProps> = ({ children, className = '', delay = 0 }) => (
  <motion.span
    className={`inline-block relative ${className}`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
  >
    <span
      className="shimmer-text bg-clip-text text-transparent"
      style={{
        backgroundImage:
          'linear-gradient(90deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 40%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 60%, hsl(var(--foreground)) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
      }}
    >
      {children}
    </span>
  </motion.span>
);

export default ShimmerText;
