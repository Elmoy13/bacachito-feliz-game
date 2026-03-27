import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  onChildAdded,
  onChildRemoved,
  onDisconnect,
  serverTimestamp,
  query,
  orderByChild,
  endAt,
  type DatabaseReference,
  type Unsubscribe,
} from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import type {
  RoomMeta,
  RoomPlayer,
  RoomGameState,
  ResolvedCard,
  VoteState,
  Room,
  ActiveTimer,
} from '@/types/multiplayer';
import { ROOM_TTL_MS, MAX_ROOM_PLAYERS, PLAYER_EMOJIS } from '@/types/multiplayer';
import { generateRoomCode } from '@/utils/roomCode';

// ─── Refs ───

const roomRef = (code: string) => ref(rtdb, `rooms/${code}`);
const metaRef = (code: string) => ref(rtdb, `rooms/${code}/meta`);
const playersRef = (code: string) => ref(rtdb, `rooms/${code}/players`);
const playerRef = (code: string, uid: string) => ref(rtdb, `rooms/${code}/players/${uid}`);
const gameStateRef = (code: string) => ref(rtdb, `rooms/${code}/gameState`);
const reactionsRef = (code: string) => ref(rtdb, `rooms/${code}/reactions`);
const voteRef = (code: string) => ref(rtdb, `rooms/${code}/currentVote`);
const votePlayerRef = (code: string, uid: string) => ref(rtdb, `rooms/${code}/currentVote/votes/${uid}`);

// ─── Room lifecycle ───

export async function createRoom(hostUid: string, hostName: string, mode: string, slangRegion: string = 'neutro'): Promise<string> {
  // Clean up old rooms first
  await cleanupOldRooms();

  // Generate unique code
  let code = generateRoomCode();
  let exists = true;
  let attempts = 0;
  while (exists && attempts < 10) {
    const snap = await get(metaRef(code));
    exists = snap.exists();
    if (exists) {
      code = generateRoomCode();
      attempts++;
    }
  }

  const meta: RoomMeta = {
    code,
    hostUid,
    hostName,
    mode,
    slangRegion,
    status: 'waiting',
    maxPlayers: MAX_ROOM_PLAYERS,
    createdAt: Date.now(),
  };

  const hostPlayer: RoomPlayer = {
    name: hostName,
    emoji: PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)],
    isHost: true,
    isOnline: true,
    joinedAt: Date.now(),
    lastSeen: Date.now(),
  };

  await set(roomRef(code), {
    meta,
    players: { [hostUid]: hostPlayer },
  });

  return code;
}

export async function joinRoom(
  roomCode: string,
  uid: string,
  playerName: string
): Promise<{ success: boolean; error?: string }> {
  const metaSnap = await get(metaRef(roomCode));
  if (!metaSnap.exists()) {
    return { success: false, error: 'Sala no encontrada 🤷' };
  }

  const meta = metaSnap.val() as RoomMeta;

  if (meta.status === 'finished') {
    return { success: false, error: 'La peda ya terminó 😅' };
  }

  const playersSnap = await get(playersRef(roomCode));
  const players = playersSnap.val() as Record<string, RoomPlayer> | null;
  const playerCount = players ? Object.keys(players).length : 0;

  if (playerCount >= meta.maxPlayers) {
    return { success: false, error: 'Sala llena, ya no caben más borrachos' };
  }

  // Check duplicate name
  if (players) {
    const nameTaken = Object.values(players).some(
      (p) => p.name.toLowerCase() === playerName.toLowerCase()
    );
    if (nameTaken) {
      return { success: false, error: `Ya hay un ${playerName} en la peda, ponle otro` };
    }
  }

  // Pick an emoji not yet used
  const usedEmojis = players ? Object.values(players).map((p) => p.emoji) : [];
  const available = PLAYER_EMOJIS.filter((e) => !usedEmojis.includes(e));
  const emoji = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)];

  const player: RoomPlayer = {
    name: playerName,
    emoji,
    isHost: false,
    isOnline: true,
    joinedAt: Date.now(),
    lastSeen: Date.now(),
  };

  await set(playerRef(roomCode, uid), player);
  return { success: true };
}

export async function leaveRoom(roomCode: string, uid: string): Promise<void> {
  await remove(playerRef(roomCode, uid));
}

// ─── Game state (host-only writes) ───

export async function startMultiplayerGame(
  roomCode: string,
  cards: ResolvedCard[]
): Promise<void> {
  await update(metaRef(roomCode), { status: 'playing' });
  await set(gameStateRef(roomCode), {
    currentCardIndex: 0,
    cards,
  });
}

export async function advanceCard(roomCode: string, newIndex: number): Promise<void> {
  await update(gameStateRef(roomCode), { currentCardIndex: newIndex });
}

export async function setGameFinished(roomCode: string): Promise<void> {
  await update(metaRef(roomCode), { status: 'finished' });
}

// ─── Reactions ───

export async function sendReaction(
  roomCode: string,
  emoji: string,
  playerName: string
): Promise<void> {
  const newRef = push(reactionsRef(roomCode));
  await set(newRef, {
    emoji,
    playerName,
    timestamp: Date.now(),
  });
  // Auto-cleanup after 3s
  setTimeout(() => {
    remove(newRef).catch(() => {});
  }, 3000);
}

// ─── Voting ───

export async function startVote(
  roomCode: string,
  question: string,
  candidates: string[]
): Promise<void> {
  await set(voteRef(roomCode), {
    question,
    candidates,
    votes: {},
    results: null,
  });
}

export async function castVote(
  roomCode: string,
  uid: string,
  candidateName: string
): Promise<void> {
  await set(votePlayerRef(roomCode, uid), candidateName);
}

export async function endVote(roomCode: string): Promise<void> {
  const snap = await get(voteRef(roomCode));
  if (!snap.exists()) return;

  const vote = snap.val() as VoteState;
  const voteCounts: Record<string, number> = {};
  if (vote.votes) {
    Object.values(vote.votes).forEach((name) => {
      voteCounts[name] = (voteCounts[name] || 0) + 1;
    });
  }

  let winner = vote.candidates[0];
  let maxCount = 0;
  Object.entries(voteCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      winner = name;
      maxCount = count;
    }
  });

  await update(voteRef(roomCode), {
    results: { winner, count: maxCount },
  });
}

export async function clearVote(roomCode: string): Promise<void> {
  await remove(voteRef(roomCode));
}

// ─── Presence ───

export function setupPresence(roomCode: string, uid: string): () => void {
  const pRef = playerRef(roomCode, uid);
  const connectedRef = ref(rtdb, '.info/connected');

  const unsub = onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      update(pRef, { isOnline: true, lastSeen: Date.now() });
      onDisconnect(pRef).update({ isOnline: false, lastSeen: Date.now() });
    }
  });

  // Heartbeat
  const interval = setInterval(() => {
    update(pRef, { lastSeen: Date.now() }).catch(() => {});
  }, 30_000);

  return () => {
    unsub();
    clearInterval(interval);
  };
}

// ─── Subscriptions ───

export function subscribeToRoom(
  roomCode: string,
  onData: (room: Room | null) => void
): Unsubscribe {
  return onValue(roomRef(roomCode), (snap) => {
    onData(snap.exists() ? (snap.val() as Room) : null);
  });
}

export function subscribeToReactions(
  roomCode: string,
  onReaction: (reaction: { id: string; emoji: string; playerName: string; timestamp: number }) => void
): Unsubscribe {
  return onChildAdded(reactionsRef(roomCode), (snap) => {
    const data = snap.val();
    if (data) {
      onReaction({ id: snap.key!, ...data });
    }
  });
}

// ─── Cleanup ───

async function cleanupOldRooms(): Promise<void> {
  try {
    const roomsSnap = await get(ref(rtdb, 'rooms'));
    if (!roomsSnap.exists()) return;

    const rooms = roomsSnap.val() as Record<string, { meta?: RoomMeta }>;
    const now = Date.now();
    const deletes: Promise<void>[] = [];

    Object.entries(rooms).forEach(([code, room]) => {
      if (room.meta && now - room.meta.createdAt > ROOM_TTL_MS) {
        deletes.push(remove(roomRef(code)));
      }
    });

    await Promise.all(deletes);
  } catch {
    // Non-critical
  }
}
