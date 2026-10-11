import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  className?: string;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-500 border border-amber-400/30 ${className}`}
  >
    <Crown size={10} />
    VIP
  </span>
);

export default PremiumBadge;
