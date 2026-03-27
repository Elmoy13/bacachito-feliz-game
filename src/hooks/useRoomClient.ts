import { useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { trackEvent } from '@/lib/firebase';
import {
  joinRoom as joinRoomService,
  leaveRoom as leaveRoomService,
  castVote as castVoteService,
  sendReaction as sendReactionService,
} from '@/services/roomService';

export function useRoomClient() {
  const { uid } = useUser();

  const joinRoom = useCallback(
    async (roomCode: string, playerName: string) => {
      if (!uid) throw new Error('Not authenticated');
      const result = await joinRoomService(roomCode, uid, playerName);
      if (result.success) {
        trackEvent('multiplayer_room_joined', { room_code: roomCode });
      }
      return result;
    },
    [uid]
  );

  const leaveRoom = useCallback(
    async (roomCode: string) => {
      if (!uid) return;
      await leaveRoomService(roomCode, uid);
    },
    [uid]
  );

  const castVote = useCallback(
    async (roomCode: string, candidateName: string) => {
      if (!uid) return;
      await castVoteService(roomCode, uid, candidateName);
      trackEvent('multiplayer_vote_cast');
    },
    [uid]
  );

  const sendReaction = useCallback(
    async (roomCode: string, emoji: string, playerName: string) => {
      await sendReactionService(roomCode, emoji, playerName);
      trackEvent('multiplayer_reaction_sent', { emoji });
    },
    []
  );

  return { joinRoom, leaveRoom, castVote, sendReaction };
}
