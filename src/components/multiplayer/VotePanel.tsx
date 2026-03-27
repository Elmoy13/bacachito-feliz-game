import React from 'react';
import { motion } from 'framer-motion';
import type { VoteState } from '@/types/multiplayer';

interface VotePanelProps {
  vote: VoteState;
  totalPlayers: number;
  onVote: (candidate: string) => void;
  myVote: string | null;
  isHost: boolean;
  onEndVote?: () => void;
}

const VotePanel: React.FC<VotePanelProps> = ({
  vote,
  totalPlayers,
  onVote,
  myVote,
  isHost,
  onEndVote,
}) => {
  const voteCount = vote.votes ? Object.keys(vote.votes).length : 0;
  const hasResults = !!vote.results;

  // Count votes per candidate
  const counts: Record<string, number> = {};
  vote.candidates.forEach((c) => { counts[c] = 0; });
  if (vote.votes) {
    Object.values(vote.votes).forEach((name) => {
      counts[name] = (counts[name] || 0) + 1;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-5"
    >
      <h3 className="font-semibold text-foreground text-center mb-1">{vote.question}</h3>
      <p className="text-xs text-muted-foreground text-center mb-4">
        {hasResults ? '¡Resultado!' : `Votos: ${voteCount}/${totalPlayers}`}
      </p>

      <div className="space-y-2">
        {vote.candidates.map((candidate) => {
          const pct = voteCount > 0 ? (counts[candidate] / voteCount) * 100 : 0;
          const isWinner = hasResults && vote.results?.winner === candidate;

          return (
            <motion.button
              key={candidate}
              onClick={() => !myVote && !hasResults && onVote(candidate)}
              disabled={!!myVote || hasResults}
              animate={isWinner ? { scale: [1, 1.03, 1] } : {}}
              transition={isWinner ? { repeat: 2, duration: 0.3 } : {}}
              className={`w-full relative overflow-hidden rounded-xl px-4 py-3 text-left transition-all ${
                isWinner
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                  : myVote === candidate
                  ? 'bg-primary/20 border border-primary/40'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              {/* Progress bar */}
              {(hasResults || myVote) && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary/10"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="font-medium text-sm">{candidate}</span>
                {(hasResults || myVote) && (
                  <span className="text-xs font-bold">
                    {counts[candidate]} {isWinner && '🍻'}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {isHost && !hasResults && (
        <button
          onClick={onEndVote}
          className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cerrar votación
        </button>
      )}

      {hasResults && vote.results && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-4 font-bold text-foreground"
        >
          ¡{vote.results.winner} ganó con {vote.results.count} voto{vote.results.count !== 1 ? 's' : ''}! 🍻 BEBE
        </motion.p>
      )}
    </motion.div>
  );
};

export default VotePanel;
