import { useState, useEffect, useRef } from 'react';
import { subscribeToRoom, setupPresence } from '@/services/roomService';
import { useUser } from '@/context/UserContext';
import type { Room, RoomPlayer, RoomGameState, VoteState } from '@/types/multiplayer';

export function useRoom(roomCode: string | undefined) {
  const { uid } = useUser();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const presenceCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      setError('No room code');
      return;
    }

    const unsub = subscribeToRoom(roomCode, (data) => {
      setRoom(data);
      setLoading(false);
      if (!data) setError('Sala no encontrada');
      else setError(null);
    });

    return () => unsub();
  }, [roomCode]);

  // Setup presence when uid and room are available
  useEffect(() => {
    if (!roomCode || !uid || !room) return;

    // Only setup if this player is in the room
    const players = room.players || {};
    if (!players[uid]) return;

    if (!presenceCleanupRef.current) {
      presenceCleanupRef.current = setupPresence(roomCode, uid);
    }

    return () => {
      if (presenceCleanupRef.current) {
        presenceCleanupRef.current();
        presenceCleanupRef.current = null;
      }
    };
  }, [roomCode, uid, !!room?.players?.[uid ?? '']]);

  const players: RoomPlayer[] = room?.players
    ? Object.entries(room.players).map(([id, p]) => ({ ...p, id } as RoomPlayer & { id: string }))
    : [];

  const isHost = !!uid && room?.meta?.hostUid === uid;
  const currentVote = room?.currentVote ?? null;
  const meta = room?.meta ?? null;

  // RTDB may return arrays as objects with numeric keys — normalize cards to a real array
  const gameState = (() => {
    const gs = room?.gameState;
    if (!gs) return null;
    let cards = gs.cards;
    if (cards && !Array.isArray(cards)) {
      // Convert { "0": card0, "1": card1, ... } → [card0, card1, ...]
      const keys = Object.keys(cards).map(Number).sort((a, b) => a - b);
      cards = keys.map((k) => (cards as any)[k]);
    }
    return { ...gs, cards: cards ?? [] };
  })();

  return {
    room,
    meta,
    players,
    playersMap: room?.players ?? {},
    isHost,
    gameState,
    currentVote,
    loading,
    error,
  };
}
