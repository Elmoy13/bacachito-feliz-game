import { motion } from 'framer-motion';

const OxxoPendingBanner: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
  >
    <p className="font-medium">⏳ Tu pago en OXXO está pendiente</p>
    <p className="text-xs mt-1 opacity-80">
      Te activamos en cuanto se confirme el pago (máx 24 horas).
    </p>
  </motion.div>
);

export default OxxoPendingBanner;
