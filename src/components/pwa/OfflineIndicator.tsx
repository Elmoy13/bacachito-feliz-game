import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className="fixed top-4 left-1/2 z-[100] flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{
            background: 'rgba(239, 68, 68, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <WifiOff size={16} />
          <span>Sin conexión</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
