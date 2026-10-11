import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getPrefieresMinorityText, PREFIERES_TIE_TEXT } from '@/utils/prefieres';

interface PrefieresContentProps {
  title: string;
  optionA: string;
  optionB: string;
  sips?: number;
  /** Cambia cuando cambia la carta, para reiniciar la cuenta regresiva */
  resetKey?: string | number;
}

const COUNTDOWN_STEPS = ['1', '2', '3'] as const;
const STEP_MS = 800;
const VOTEN_MS = 1200;

// idle → counting (1, 2, 3) → voted (¡VOTEN!)
type Phase = 'idle' | 'counting' | 'voted';

/**
 * Contenido de una carta "¿Qué prefieres?": dos opciones (👍 / 👎),
 * la regla de la minoría y una cuenta regresiva "¡A la de 3!".
 * Se usa tanto en el juego local como en multijugador.
 */
const PrefieresContent: React.FC<PrefieresContentProps> = ({ title, optionA, optionB, sips, resetKey }) => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(0);
  const [showVoten, setShowVoten] = useState(false);

  // Reiniciar al cambiar de carta
  useEffect(() => {
    setPhase('idle');
    setStep(0);
    setShowVoten(false);
  }, [resetKey]);

  // Avanzar la cuenta regresiva: 1 → 2 → 3 → ¡VOTEN!
  useEffect(() => {
    if (phase !== 'counting') return;
    const timer = setTimeout(() => {
      if (step < COUNTDOWN_STEPS.length - 1) {
        setStep((s) => s + 1);
      } else {
        setPhase('voted');
        setShowVoten(true);
      }
    }, STEP_MS);
    return () => clearTimeout(timer);
  }, [phase, step]);

  // "¡VOTEN!" se muestra un momento y luego deja ver las opciones y la regla
  useEffect(() => {
    if (!showVoten) return;
    const timer = setTimeout(() => setShowVoten(false), VOTEN_MS);
    return () => clearTimeout(timer);
  }, [showVoten]);

  const isVoted = phase === 'voted';
  const isCounting = phase === 'counting';
  // Botón bloqueado mientras corre la cuenta o se muestra "¡VOTEN!"
  const isBusy = isCounting || showVoten;

  const startCountdown = (e: React.MouseEvent) => {
    // No avanzar la carta
    e.stopPropagation();
    if (isBusy) return;
    setStep(0);
    setPhase('counting');
  };

  const stopKeyPropagation = (e: React.KeyboardEvent) => {
    // Espacio/Enter sobre el botón no deben avanzar la carta
    e.stopPropagation();
  };

  const stepVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.4 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.6 },
      };


  const renderOption = (emoji: string, label: string, text: string, delay: number) => (
    <motion.div
      className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left bg-white/15 border border-white/25 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <span
        className="shrink-0 w-12 h-12 rounded-full bg-white/25 flex items-center justify-center text-2xl"
        role="img"
        aria-label={label}
      >
        {emoji}
      </span>
      <span className="text-lg sm:text-xl font-bold leading-snug">{text}</span>
    </motion.div>
  );

  return (
    <div className="w-full flex flex-col items-center mt-6">
      {/* Lead-in */}
      <motion.h2
        className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-4 px-2"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {title}
      </motion.h2>

      {/* Opciones */}
      <div className="w-full flex flex-col items-center gap-2">
        {renderOption('👍', 'Pulgar arriba', optionA, 0.2)}
        <span className="px-3 py-0.5 rounded-full bg-white/90 text-teal-800 text-xs font-black uppercase tracking-widest">
          o
        </span>
        {renderOption('👎', 'Pulgar abajo', optionB, 0.28)}
      </div>

      {/* Regla */}
      <motion.div
        className={`mt-4 rounded-xl px-3 py-2 text-sm transition-colors ${
          isVoted ? 'bg-white/25 font-bold text-base' : 'opacity-90 font-medium'
        }`}
        initial={{ opacity: 0 }}
        animate={isVoted && !prefersReducedMotion ? { opacity: 1, scale: [1, 1.08, 1] } : { opacity: 1, scale: 1 }}
        transition={isVoted ? { duration: 0.5 } : { delay: 0.35 }}
      >
        <p>{getPrefieresMinorityText(sips)}</p>
        <p className={isVoted ? 'text-sm font-semibold opacity-90' : 'text-xs opacity-80'}>{PREFIERES_TIE_TEXT}</p>
      </motion.div>

      {/* Botón de cuenta regresiva */}
      <motion.button
        type="button"
        onClick={startCountdown}
        onKeyDown={stopKeyPropagation}
        aria-disabled={isBusy}
        className={`mt-4 py-3 px-6 rounded-xl bg-white text-teal-800 font-black shadow-lg transition-all hover:bg-white/90 active:scale-95 ${
          isBusy ? 'opacity-60 cursor-default' : ''
        }`}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {isVoted ? 'Otra vez 🔁' : '¡A la de 3! 👍👎'}
      </motion.button>

      {/* Anuncio para lectores de pantalla (región persistente) */}
      <span className="sr-only" aria-live="assertive">
        {isCounting ? `Cuenta: ${COUNTDOWN_STEPS[step]}` : showVoten ? '¡Voten ya!' : ''}
      </span>

      {/* Overlay de cuenta regresiva */}
      <AnimatePresence>
        {(isCounting || showVoten) && (
          <motion.div
            key="prefieres-countdown"
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none rounded-3xl bg-black/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          >
            {/* Sin mode="wait": cada número entra mientras el anterior sale (cuenta fluida) */}
            <AnimatePresence>
              {isCounting ? (
                <motion.span
                  key={`step-${step}`}
                  className="absolute text-[8rem] leading-none font-black drop-shadow-2xl"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: prefersReducedMotion ? 0.15 : 0.35 }}
                >
                  {COUNTDOWN_STEPS[step]}
                </motion.span>
              ) : (
                <motion.span
                  key="voten"
                  className="absolute text-5xl sm:text-6xl font-black drop-shadow-2xl"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: prefersReducedMotion ? 0.15 : 0.35 }}
                >
                  ¡VOTEN!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrefieresContent;
