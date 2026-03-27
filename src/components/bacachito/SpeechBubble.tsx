import { AnimatePresence, motion } from 'framer-motion';

interface SpeechBubbleProps {
  text: string | null;
  isVisible: boolean;
  position?: 'top' | 'right' | 'inline-right';
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, isVisible, position = 'right' }) => {
  const isRight = position === 'right';
  const isInlineRight = position === 'inline-right';

  const positionClass = isInlineRight
    ? ''
    : isRight
      ? 'absolute z-10 left-full top-[45%] -translate-y-1/2 ml-1.5'
      : 'absolute z-10 -top-2 left-1/2 -translate-x-1/2 -translate-y-full';

  const showLeftTail = isRight || isInlineRight;

  return (
    <AnimatePresence>
      {isVisible && text && (
        <motion.div
          className={positionClass}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 0.25 }}
        >
          <div className="relative max-w-[10rem] sm:max-w-[12rem] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-white/95 backdrop-blur-sm border border-white/50 shadow-lg">
            <p className="text-[11px] sm:text-xs leading-tight text-gray-900 font-medium text-center">
              {text}
            </p>
            {/* Triangle tail */}
            {showLeftTail ? (
              <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-2.5 rotate-45 bg-white/90 dark:bg-white/95 border-l border-b border-white/50" />
            ) : (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/90 dark:bg-white/95 border-r border-b border-white/50" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechBubble;
