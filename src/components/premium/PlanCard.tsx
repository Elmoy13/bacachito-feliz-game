import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Plan } from '@/config/stripe';

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selected, onSelect }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onSelect}
    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${
      selected
        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
        : 'border-border bg-card hover:border-muted-foreground/30'
    }`}
  >
    {plan.badge && (
      <span
        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          plan.popular ? 'bg-primary text-primary-foreground' : 'bg-amber-400 text-amber-900'
        }`}
      >
        {plan.badge}
      </span>
    )}
    <span className="text-sm font-semibold text-foreground mt-1">{plan.name}</span>
    <span className="text-xl font-bold text-foreground">${plan.price}</span>
    <span className="text-[10px] text-muted-foreground">{plan.currency}</span>

    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
      >
        <Check size={12} className="text-primary-foreground" />
      </motion.div>
    )}
  </motion.button>
);

export default PlanCard;
