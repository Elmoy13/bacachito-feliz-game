import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const UpdatePrompt: React.FC = () => {
  const { needRefresh, updateServiceWorker, dismissRefresh } = usePWA();

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          className="fixed top-4 left-4 right-4 z-[100] max-w-md mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-3 text-white"
            style={{
              background: 'rgba(37, 99, 235, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <RefreshCw size={20} className="flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">
              Nueva versión disponible
            </p>
            <button
              onClick={updateServiceWorker}
              className="flex-shrink-0 px-4 py-1.5 rounded-xl bg-white text-primary font-bold text-sm transition-all hover:bg-white/90"
            >
              Actualizar
            </button>
            <button
              onClick={dismissRefresh}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdatePrompt;
