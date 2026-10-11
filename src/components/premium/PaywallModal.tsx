import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Lock, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/hooks/useCheckout';
import { trackEvent } from '@/lib/firebase';
import { PLANS, type Plan, type PlanId } from '@/config/stripe';
import PlanCard from '@/components/premium/PlanCard';
import BacachitoLogo from '@/components/BacachitoLogo';

interface PaywallModalProps {
  onClose: () => void;
  trigger?: string;
}

const FEATURES = [
  '4 modos extra (Hot, Fiesta…)',
  'Peda Remota (multijugador)',
  'Cartas personalizadas',
  '+400 cartas exclusivas',
];

const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, trigger = 'feature_gate' }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { startCheckout, loading, error } = useCheckout();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

  useEffect(() => {
    trackEvent('paywall_shown', { trigger });
  }, [trigger]);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan.id);
    trackEvent('paywall_plan_selected', { plan: plan.id, price_mxn: plan.price });
  };

  const handleUnlock = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    await startCheckout(selectedPlan);
  };

  const currentPlan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="paywall-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        key="paywall-panel"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="p-6 pb-8">
            {/* Header */}
            <div className="flex items-center mb-6">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-4">
              <BacachitoLogo size="lg" animate />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-foreground mb-1">
              Desbloquea la peda
            </h2>
            <p className="text-2xl font-bold text-center text-primary mb-6">COMPLETA</p>

            {/* Features */}
            <div className="space-y-2.5 mb-6">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan === plan.id}
                  onSelect={() => handleSelectPlan(plan)}
                />
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground mb-5">
              {currentPlan.description}
            </p>

            {/* CTA */}
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-semibold"
            >
              {loading ? 'Procesando…' : 'Desbloquear ahora 🍻'}
            </button>

            {error && <p className="text-sm text-destructive text-center mt-3">{error}</p>}

            {/* Trust */}
            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
              <Lock size={12} />
              <span>Pago seguro con Stripe</span>
              <span className="mx-1">·</span>
              <CreditCard size={12} />
              <span>Tarjeta, OXXO y transferencia</span>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">Cancela cuando quieras</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaywallModal;
