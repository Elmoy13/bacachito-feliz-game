import { useState, useEffect, useRef, useCallback } from 'react';
import { subscribeToReactions } from '@/services/roomService';
import type { Reaction } from '@/types/multiplayer';
import {
  REACTION_COOLDOWN_MS,
  MAX_REACTIONS_PER_COOLDOWN,
  REACTION_DISPLAY_MS,
} from '@/types/multiplayer';

export function useReactions(roomCode: string | undefined) {
  const [reactions, setReactions] = useState<(Reaction & { x: number })[]>([]);
  const cooldownRef = useRef<number[]>([]);

  useEffect(() => {
    if (!roomCode) return;

    const unsub = subscribeToReactions(roomCode, (reaction) => {
      const enriched = { ...reaction, x: 10 + Math.random() * 80 }; // random X position %
      setReactions((prev) => [...prev, enriched]);

      // Auto-remove after display duration
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
      }, REACTION_DISPLAY_MS);
    });

    return () => unsub();
  }, [roomCode]);

  const canSendReaction = useCallback((): boolean => {
    const now = Date.now();
    // Clean old timestamps
    cooldownRef.current = cooldownRef.current.filter(
      (t) => now - t < REACTION_COOLDOWN_MS
    );
    return cooldownRef.current.length < MAX_REACTIONS_PER_COOLDOWN;
  }, []);

  const recordReactionSent = useCallback(() => {
    cooldownRef.current.push(Date.now());
  }, []);

  return { reactions, canSendReaction, recordReactionSent };
}
