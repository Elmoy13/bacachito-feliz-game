import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Zap, Target, Crown, Sparkles } from 'lucide-react';
import { useRoom } from '@/hooks/useRoom';
import { useRoomHost } from '@/hooks/useRoomHost';
import { useRoomClient } from '@/hooks/useRoomClient';
import { useReactions } from '@/hooks/useReactions';
import { useUser } from '@/context/UserContext';
import { applySlang } from '@/utils/slangEngine';
import type { SlangRegion } from '@/types/slang';
import type { ResolvedCard, VoteState } from '@/types/multiplayer';
import ConnectionBadge from './ConnectionBadge';
import ReactionBar from './ReactionBar';
import FloatingReactions from './FloatingReactions';
import VotePanel from './VotePanel';
import HostDisconnected from './HostDisconnected';
import RegionBadge from '@/components/game/RegionBadge';

const MultiplayerGame: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { uid } = useUser();
  const { room, meta, playersMap, isHost, gameState, currentVote } = useRoom(roomCode);
  const { advance, goBack, startVote, endVote: endVoteAction, clearVote } = useRoomHost();
  const { castVote, sendReaction, leaveRoom } = useRoomClient();
  const { reactions, canSendReaction, recordReactionSent } = useReactions(roomCode);

  const [direction, setDirection] = useState(0);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownNum, setCountdownNum] = useState(3);

  // If user is not a player in this room, redirect to join page to enter their name
  useEffect(() => {
    if (!uid || !room || !roomCode) return;
    const isInRoom = !!room.players?.[uid];
    if (!isInRoom) {
      navigate(`/join/${roomCode}`, { replace: true });
    }
  }, [uid, room, roomCode, navigate]);

  // Countdown on game start
  useEffect(() => {
    if (!showCountdown) return;
    if (countdownNum <= 0) {
      setShowCountdown(false);
      return;
    }
    const timer = setTimeout(() => setCountdownNum((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdownNum, showCountdown]);

  const cards = gameState?.cards ?? [];
  const currentIndex = gameState?.currentCardIndex ?? 0;
  const currentCard: ResolvedCard | null = cards[currentIndex] ?? null;
  const totalCards = cards.length;
  const roomSlangRegion = (meta?.slangRegion as SlangRegion) || 'neutro';

  // Apply slang to card text client-side
  const displayText = useMemo(
    () => (currentCard ? applySlang(currentCard.text, roomSlangRegion) : ''),
    [currentCard, roomSlangRegion]
  );
  const displaySubtitle = useMemo(
    () => (currentCard?.subtitle ? applySlang(currentCard.subtitle, roomSlangRegion) : ''),
    [currentCard, roomSlangRegion]
  );

  const onlinePlayers = useMemo(
    () => Object.values(playersMap).filter((p) => p.isOnline).length,
    [playersMap]
  );

  // Host controls
  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHost || !roomCode) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;

      if (x < width * 0.25) {
        setDirection(-1);
        goBack(roomCode, currentIndex);
      } else {
        setDirection(1);
        advance(roomCode, currentIndex, totalCards);
      }
    },
    [isHost, roomCode, currentIndex, totalCards, advance, goBack]
  );

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      if (!isHost || !roomCode) return;
      const threshold = 50;
      if (info.offset.x < -threshold) {
        setDirection(1);
        advance(roomCode, currentIndex, totalCards);
      } else if (info.offset.x > threshold) {
        setDirection(-1);
        goBack(roomCode, currentIndex);
      }
    },
    [isHost, roomCode, currentIndex, totalCards, advance, goBack]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isHost || !roomCode) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setDirection(1);
        advance(roomCode, currentIndex, totalCards);
      } else if (e.key === 'ArrowLeft') {
        setDirection(-1);
        goBack(roomCode, currentIndex);
      }
    },
    [isHost, roomCode, currentIndex, totalCards, advance, goBack]
  );

  // Reaction handler
  const handleReaction = useCallback(
    (emoji: string) => {
      if (!roomCode || !uid || !canSendReaction()) return;
      const myPlayer = playersMap[uid];
      if (!myPlayer) return;
      recordReactionSent();
      sendReaction(roomCode, emoji, myPlayer.name);
    },
    [roomCode, uid, playersMap, canSendReaction, recordReactionSent, sendReaction]
  );

  // Vote handler
  const handleCastVote = useCallback(
    (candidate: string) => {
      if (!roomCode) return;
      castVote(roomCode, candidate);
    },
    [roomCode, castVote]
  );

  const handleEndVote = useCallback(() => {
    if (roomCode) endVoteAction(roomCode);
  }, [roomCode, endVoteAction]);

  const handleLeave = useCallback(async () => {
    if (roomCode) await leaveRoom(roomCode);
    navigate('/');
  }, [roomCode, leaveRoom, navigate]);

  // Detect host disconnection
  const hostPlayer = meta ? playersMap[meta.hostUid] : null;
  const hostDisconnected = !isHost && hostPlayer && !hostPlayer.isOnline;

  // Card style helpers
  const getCardClass = (card: ResolvedCard) => {
    if (card.isExtreme) return 'card-game card-game-extreme';
    if (card.isPower) return 'card-game card-game-power';
    if (card.type === 'timed') return 'card-game card-game-timed';
    if (card.type === 'category') return 'card-game card-game-category';
    return 'card-game card-game-normal';
  };

  const getBadgeText = (card: ResolvedCard) => {
    if (card.isCustom) return '✨ PERSONALIZADA';
    if (card.isExtreme) return 'EXTREMO';
    if (card.isPower) return 'PODER';
    if (card.type === 'timed') return 'TIEMPO';
    if (card.type === 'category') return 'CATEGORÍA';
    return null;
  };

  const getCardIcon = (card: ResolvedCard) => {
    if (card.isExtreme) return <Zap size={32} className="opacity-90" />;
    if (card.isPower) return <Crown size={32} className="opacity-90" />;
    if (card.type === 'timed') return <Clock size={32} className="opacity-90" />;
    if (card.type === 'category') return <Target size={32} className="opacity-90" />;
    return null;
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  };

  // Game over
  if (meta?.status === 'finished') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <h1 className="heading-display mb-4">¡Se acabó la peda! 🍻</h1>
          <p className="body-regular text-muted-foreground mb-8">
            {totalCards} cartas jugadas con {Object.keys(playersMap).length} jugadores
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  // Countdown overlay
  if (showCountdown) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={countdownNum}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {countdownNum > 0 ? (
              <span className="text-8xl font-bold text-foreground">{countdownNum}</span>
            ) : (
              <span className="text-5xl font-bold text-foreground">¡SALUD! 🍻</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando juego...</div>
      </div>
    );
  }

  const myVote =
    currentVote?.votes && uid ? (currentVote.votes[uid] ?? null) : null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
        {/* Host indicator for clients */}
        {!isHost && meta && (
          <span className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            🎮 {meta.hostName} controla
          </span>
        )}
        {isHost && <div />}

        <ConnectionBadge count={onlinePlayers} />
      </div>

      {/* Region Badge */}
      <div className="absolute top-4 right-20 z-30">
        <RegionBadge region={roomSlangRegion} />
      </div>

      {/* Card area */}
      <div
        className="w-full h-[calc(100vh-120px)] flex items-center justify-center select-none px-4 pt-14"
        onClick={isHost ? handleTap : undefined}
        onKeyDown={isHost ? handleKeyDown : undefined}
        tabIndex={isHost ? 0 : undefined}
        role={isHost ? 'button' : undefined}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard.id + currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
            drag={isHost ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={isHost ? handleDragEnd : undefined}
            className={getCardClass(currentCard)}
          >
            {/* Badge */}
            {getBadgeText(currentCard) && (
              <motion.div
                className="power-badge"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {getCardIcon(currentCard)}
                <span className="ml-1">{getBadgeText(currentCard)}</span>
              </motion.div>
            )}

            {/* Icon */}
            {!getBadgeText(currentCard) && getCardIcon(currentCard) && (
              <motion.div
                className="mb-6 opacity-80"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              >
                {getCardIcon(currentCard)}
              </motion.div>
            )}

            {/* Main text */}
            <motion.h2
              className="heading-card mb-6 leading-tight px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {displayText}
            </motion.h2>

            {/* Subtitle */}
            {displaySubtitle && (
              <motion.p
                className="body-large opacity-90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {displaySubtitle}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom area */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        {/* Vote panel */}
        {currentVote && !currentVote.results && (
          <div className="mb-3">
            <VotePanel
              vote={currentVote}
              totalPlayers={Object.keys(playersMap).length}
              onVote={handleCastVote}
              myVote={myVote}
              isHost={isHost}
              onEndVote={handleEndVote}
            />
          </div>
        )}

        {/* Reaction bar for clients */}
        {!isHost && (
          <ReactionBar
            onReaction={handleReaction}
            disabled={!canSendReaction()}
          />
        )}
      </div>

      {/* Floating reactions */}
      <FloatingReactions reactions={reactions} />

      {/* Host disconnected overlay */}
      {hostDisconnected && <HostDisconnected onLeave={handleLeave} />}
    </div>
  );
};

export default MultiplayerGame;
