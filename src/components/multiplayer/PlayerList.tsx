import React from 'react';
import { motion } from 'framer-motion';
import type { RoomPlayer } from '@/types/multiplayer';

interface PlayerListProps {
  players: Record<string, RoomPlayer>;
  hostUid?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, hostUid }) => {
  const entries = Object.entries(players);

  return (
    <div className="space-y-2">
      {entries.map(([uid, player], index) => (
        <motion.div
          key={uid}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
            player.isOnline ? 'bg-card' : 'bg-card/50 opacity-50'
          }`}
        >
          <span className="text-2xl">{player.emoji}</span>
          <span className="font-medium text-foreground flex-1">{player.name}</span>
          {uid === hostUid && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
              👑 Host
            </span>
          )}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              player.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerList;
