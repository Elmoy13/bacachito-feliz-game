import React from 'react';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction, emoji = '📝' }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="text-5xl mb-4">{emoji}</span>
      <h3 className="heading-medium mb-2">{title}</h3>
      <p className="body-regular text-muted-foreground mb-6 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          <PenLine size={16} className="mr-2" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
