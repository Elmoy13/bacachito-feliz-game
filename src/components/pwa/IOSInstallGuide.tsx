import React from 'react';
import { motion } from 'framer-motion';
import { Share, Plus } from 'lucide-react';

interface IOSInstallGuideProps {
  onClose: () => void;
}

const IOSInstallGuide: React.FC<IOSInstallGuideProps> = ({ onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md mx-4 mb-6 rounded-3xl p-6 text-foreground"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          Instalar Bacachito Feliz
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Toca el botón de <strong>Compartir</strong>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Share size={18} className="text-primary" />
                <span className="text-xs text-gray-500">
                  (en la barra inferior de Safari)
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Selecciona <strong>"Agregar a inicio"</strong>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Plus size={18} className="text-primary" />
                <span className="text-xs text-gray-500">
                  Busca la opción en el menú
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Toca <strong>"Agregar"</strong> para confirmar
              </p>
              <span className="text-xs text-gray-500">
                ¡Listo! Bacachito aparecerá en tu pantalla de inicio
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Entendido
        </button>
      </motion.div>
    </motion.div>
  );
};

export default IOSInstallGuide;
