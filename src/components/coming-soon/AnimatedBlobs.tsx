import { motion } from 'framer-motion';

const blobs = [
  {
    // Azul primario
    color: 'hsl(221 83% 53%)',
    size: 380,
    opacity: 0.15,
    darkOpacity: 0.2,
    x: [-20, 40, -10, 30, -20],
    y: [0, -30, 20, -10, 0],
    duration: 20,
    top: '15%',
    left: '10%',
  },
  {
    // Púrpura
    color: 'hsl(260 70% 60%)',
    size: 320,
    opacity: 0.1,
    darkOpacity: 0.15,
    x: [10, -30, 20, -20, 10],
    y: [-10, 20, -30, 10, -10],
    duration: 25,
    top: '55%',
    left: '55%',
  },
  {
    // Azul claro
    color: 'hsl(200 80% 70%)',
    size: 340,
    opacity: 0.12,
    darkOpacity: 0.16,
    x: [0, 30, -20, 15, 0],
    y: [10, -20, 10, -30, 10],
    duration: 18,
    top: '35%',
    left: '-5%',
  },
];

const AnimatedBlobs: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {blobs.map((blob, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full will-change-transform"
        style={{
          width: blob.size,
          height: blob.size,
          top: blob.top,
          left: blob.left,
          background: blob.color,
          opacity: blob.opacity,
          filter: 'blur(80px)',
        }}
        animate={{ x: blob.x, y: blob.y }}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

export default AnimatedBlobs;
