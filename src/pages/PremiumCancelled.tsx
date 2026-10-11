import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BacachitoLogo from '@/components/BacachitoLogo';
import PaywallModal from '@/components/premium/PaywallModal';

const PremiumCancelled: React.FC = () => {
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <div className="min-h-screen bg-background px-6 py-12 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-md w-full text-center"
      >
        <BacachitoLogo size="lg" />

        <h1 className="text-2xl font-bold text-foreground mt-6 mb-2">¿Cambiaste de opinión?</h1>
        <p className="text-muted-foreground mb-8">
          No hay bronca. Los modos gratis siempre están disponibles.
        </p>

        <div className="space-y-3">
          <button onClick={() => navigate('/')} className="btn-primary w-full py-4 text-base">
            Volver al juego
          </button>
          <button onClick={() => setShowPaywall(true)} className="btn-ghost w-full py-3 text-sm">
            Ver planes de nuevo
          </button>
        </div>
      </motion.div>

      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} trigger="cancelled_page" />
      )}
    </div>
  );
};

export default PremiumCancelled;
