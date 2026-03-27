import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { HOST_DISCONNECT_TIMEOUT_MS } from '@/types/multiplayer';

interface HostDisconnectedProps {
  onLeave: () => void;
}

const HostDisconnected: React.FC<HostDisconnectedProps> = ({ onLeave }) => {
  const [elapsed, setElapsed] = useState(0);
  const showLeave = elapsed >= HOST_DISCONNECT_TIMEOUT_MS;

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="text-center max-w-sm">
        <Loader2 className="w-10 h-10 mx-auto mb-4 text-muted-foreground animate-spin" />
        <h2 className="heading-medium mb-2">El host se desconectó...</h2>
        <p className="body-regular text-muted-foreground mb-6">
          Esperando reconexión
        </p>
        {showLeave && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onLeave}
            className="btn-primary"
          >
            Salir de la sala
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default HostDisconnected;
