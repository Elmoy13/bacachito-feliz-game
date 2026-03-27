import React from 'react';

interface ConnectionBadgeProps {
  count: number;
}

const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({ count }) => {
  return (
    <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs font-medium text-foreground">{count}</span>
    </div>
  );
};

export default ConnectionBadge;
