import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown, Sparkles, Star } from 'lucide-react';
import Blob from '@/components/Blob';
import OxxoPendingBanner from '@/components/premium/OxxoPendingBanner';

const CONFETTI_EMOJIS = ['🎉', '🍾', '🎊', '🥂', '🍻', '🎈', '✨', '🥳', '👑'];

const PERKS = [
  { icon: '🔥', text: '4 modos extra desbloqueados' },
  { icon: '🌐', text: 'Peda Remota activada' },
  { icon: '✏️', text: 'Cartas personalizadas' },
  { icon: '🃏', text: '+400 cartas exclusivas' },
];

interface ConfettiPiece {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  size: number;
}

const PremiumSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Stripe card payments return with ?session_id=...; OXXO (async) lands here without it
  const sessionId = searchParams.get('session_id');
  const isPending = !sessionId;

  useEffect(() => {
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
      x: Math.random() * 100,
      delay: Math.random() * 3,
      size: 16 + Math.random() * 20,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background Blobs */}
      <Blob className="blob-1" delay={0} />
      <Blob className="blob-2" delay={0.2} />
      <Blob className="blob-3" delay={0.4} />

      {/* Emoji confetti */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -60, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 360 }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="fixed pointer-events-none"
          style={{ left: 0, fontSize: piece.size }}
        >
          {piece.emoji}
        </motion.div>
      ))}

      <div className="relative z-10 text-center max-w-md mx-auto w-full">
        {/* Crown badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-4"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-xl">
              <Crown size={36} className="text-white" strokeWidth={2.5} />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center"
            >
              <Sparkles size={14} className="text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <img
            src="/logosinletras.png"
            alt="Bacachito Feliz"
            className="w-32 h-32 object-contain bacachito-float"
            draggable={false}
          />
        </motion.div>

        {/* Label */}
        <motion.p
          className="label-uppercase text-amber-500 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {isPending ? 'Pago pendiente' : 'Acceso concedido'}
        </motion.p>

        {/* Heading */}
        <motion.h1
          className="heading-display mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {isPending ? '¡Casi' : 'Bienvenido al'}
          <br />
          <span className="italic bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
            {isPending ? 'listo!' : 'VIP'}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="body-elegant text-muted-foreground mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {isPending
            ? 'Tu pago está en proceso. Te activamos en cuanto se confirme.'
            : 'La elegancia de ponerse hasta atrás. Sin límites.'}
        </motion.p>

        {/* Pending banner or perks list */}
        {isPending ? (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <OxxoPendingBanner />
          </motion.div>
        ) : (
          <motion.div
            className="mb-8 space-y-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 bg-card/60 backdrop-blur-sm rounded-xl px-4 py-2.5 text-left"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <span className="text-lg flex-shrink-0">{perk.icon}</span>
                <span className="text-sm font-medium text-foreground">{perk.text}</span>
                <Star size={12} className="text-amber-400 ml-auto flex-shrink-0" fill="currentColor" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          onClick={() => navigate('/setup')}
          className="btn-editorial w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isPending ? 'Volver al juego' : 'Iniciar Peda VIP 🍻'}
        </motion.button>

        <motion.p
          className="text-xs text-muted-foreground mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {isPending
            ? 'Recibirás acceso en cuanto se confirme el pago'
            : 'Todo desbloqueado. A darle.'}
        </motion.p>
      </div>
    </div>
  );
};

export default PremiumSuccess;
