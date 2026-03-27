import { useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { gameModes, getChallengesByMode } from '@/data/challenges';
import { trackEvent } from '@/lib/firebase';
import type { Challenge } from '@/types/game';
import type { ResolvedCard, RoomPlayer } from '@/types/multiplayer';
import {
  createRoom as createRoomService,
  startMultiplayerGame,
  advanceCard,
  setGameFinished,
  startVote as startVoteService,
  endVote as endVoteService,
  clearVote as clearVoteService,
} from '@/services/roomService';

// Simple Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Select balanced challenges (simplified version for multiplayer)
function selectBalanced(challenges: Challenge[], count: number): Challenge[] {
  const byType: Record<string, Challenge[]> = {};
  challenges.forEach((c) => {
    if (!byType[c.type]) byType[c.type] = [];
    byType[c.type].push(c);
  });
  Object.keys(byType).forEach((t) => { byType[t] = shuffle(byType[t]); });

  const selected: Challenge[] = [];
  const types = Object.keys(byType);
  let idx = 0;

  // Round-robin pick to get balanced distribution
  while (selected.length < count) {
    const type = types[idx % types.length];
    const bucket = byType[type];
    if (bucket && bucket.length > 0) {
      selected.push(bucket.shift()!);
    }
    idx++;
    // Safety: if all buckets exhausted
    if (types.every((t) => (byType[t]?.length ?? 0) === 0)) break;
  }

  return shuffle(selected);
}

// Resolve {player} and {player2} in card templates
function resolveTemplate(template: string, playerNames: string[]): string {
  let text = template;
  const used: string[] = [];

  const pickPlayer = (exclude: string[]) => {
    const available = playerNames.filter((n) => !exclude.includes(n));
    if (available.length === 0) return playerNames[Math.floor(Math.random() * playerNames.length)];
    return available[Math.floor(Math.random() * available.length)];
  };

  while (text.includes('{player}')) {
    const name = pickPlayer(used);
    used.push(name);
    text = text.replace('{player}', name);
  }
  if (text.includes('{player2}')) {
    const name = pickPlayer(used);
    text = text.replace('{player2}', name);
  }

  return text;
}

export function useRoomHost() {
  const { uid } = useUser();

  const createRoom = useCallback(
    async (hostName: string, mode: string, slangRegion: string = 'neutro'): Promise<string> => {
      if (!uid) throw new Error('Not authenticated');
      const code = await createRoomService(uid, hostName, mode, slangRegion);
      trackEvent('multiplayer_room_created', { mode, max_players: 12 });
      return code;
    },
    [uid]
  );

  const startGame = useCallback(
    async (roomCode: string, mode: string, players: Record<string, { name: string }>) => {
      const playerNames = Object.values(players).map((p) => p.name);
      const challenges = getChallengesByMode(mode);
      // Random card count between 30-40 per game
      const count = Math.min(30 + Math.floor(Math.random() * 11), challenges.length);
      const selected = selectBalanced(challenges, count);

      // Resolve templates with player names
      // RTDB does not allow undefined values — only include defined fields
      const cards: ResolvedCard[] = selected.map((c) => {
        const card: ResolvedCard = {
          id: c.id,
          type: c.type,
          text: resolveTemplate(c.template, playerNames),
        };
        if (c.subtitle) card.subtitle = resolveTemplate(c.subtitle, playerNames);
        if (c.isExtreme) card.isExtreme = true;
        if (c.isPower) card.isPower = true;
        if (c.duration) card.duration = c.duration;
        if (c.hasSubGames) card.hasSubGames = true;
        return card;
      });

      await startMultiplayerGame(roomCode, cards);
      trackEvent('multiplayer_game_started', {
        player_count: playerNames.length,
        mode,
      });
    },
    []
  );

  const advance = useCallback(
    async (roomCode: string, currentIndex: number, totalCards: number) => {
      const next = currentIndex + 1;
      if (next >= totalCards) {
        await setGameFinished(roomCode);
        trackEvent('multiplayer_game_completed', {
          cards_played: totalCards,
        });
      } else {
        await advanceCard(roomCode, next);
      }
    },
    []
  );

  const goBack = useCallback(
    async (roomCode: string, currentIndex: number) => {
      if (currentIndex > 0) {
        await advanceCard(roomCode, currentIndex - 1);
      }
    },
    []
  );

  const startVoteAction = useCallback(
    async (roomCode: string, question: string, candidates: string[]) => {
      await startVoteService(roomCode, question, candidates);
    },
    []
  );

  const endVoteAction = useCallback(
    async (roomCode: string) => {
      await endVoteService(roomCode);
    },
    []
  );

  const clearVoteAction = useCallback(
    async (roomCode: string) => {
      await clearVoteService(roomCode);
    },
    []
  );

  const endGame = useCallback(async (roomCode: string) => {
    await setGameFinished(roomCode);
  }, []);

  return {
    createRoom,
    startGame,
    advance,
    goBack,
    startVote: startVoteAction,
    endVote: endVoteAction,
    clearVote: clearVoteAction,
    endGame,
  };
}
