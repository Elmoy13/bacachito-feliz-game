import { motion } from 'framer-motion';

interface BlobProps {
  className?: string;
  delay?: number;
}

const Blob: React.FC<BlobProps> = ({ className = '', delay = 0 }) => {
  return (
    <motion.div
      className={`blob ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 1.5, 
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    />
  );
};

export default Blob;
