import React, { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useRoom } from '@/hooks/useRoom';
import { useRoomHost } from '@/hooks/useRoomHost';
import PlayerList from './PlayerList';
import QRCode from './QRCode';
import { MAX_ROOM_PLAYERS } from '@/types/multiplayer';
import Bacachito from '@/components/bacachito/Bacachito';

const RoomLobby: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, meta, playersMap, isHost, loading } = useRoom(roomCode);
  const { startGame } = useRoomHost();

  const playerCount = playersMap ? Object.keys(playersMap).length : 0;
  const canStart = isHost && playerCount >= 2;
  const joinUrl = `${window.location.origin}/join/${roomCode}`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bacachito Feliz - Peda Remota',
          text: `¡Únete a mi peda! Código: ${roomCode}`,
          url: joinUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(joinUrl);
      toast.success('Link copiado al clipboard');
    }
  }, [roomCode, joinUrl]);

  const handleCopyCode = useCallback(async () => {
    await navigator.clipboard.writeText(roomCode || '');
    toast.success('Código copiado');
  }, [roomCode]);

  const handleStart = useCallback(async () => {
    if (!roomCode || !meta) return;
    await startGame(roomCode, meta.mode, playersMap as any);
    navigate(`/multiplayer/game/${roomCode}`);
  }, [roomCode, meta, playersMap, startGame, navigate]);

  // Redirect to game if already playing
  useEffect(() => {
    if (meta?.status === 'playing') {
      navigate(`/multiplayer/game/${roomCode}`, { replace: true });
    }
  }, [meta?.status, roomCode, navigate]);

  if (meta?.status === 'playing') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando sala...</div>
      </div>
    );
  }

  if (!room || !meta) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="heading-medium mb-2">Sala no encontrada</h2>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button onClick={() => navigate('/')} className="btn-ghost -ml-4 mb-4">
            <ArrowLeft size={18} className="mr-2" />
            Salir
          </button>
        </motion.div>

        {/* Room code display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-3">
            <Bacachito mood="excited" size="md" position="inline" />
          </div>
          <p className="label-uppercase text-muted-foreground mb-2">Código de sala</p>
          <motion.button
            onClick={handleCopyCode}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <h2 className="text-5xl font-mono font-bold tracking-[0.3em] text-foreground">
              {roomCode?.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  {char}
                </motion.span>
              ))}
            </h2>
          </motion.button>
          <p className="text-xs text-muted-foreground mt-2">Toca para copiar</p>
        </motion.div>

        {/* QR + Share */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <QRCode value={joinUrl} size={200} />
          <button onClick={handleShare} className="btn-ghost flex items-center gap-2">
            {navigator.share ? <Share2 size={16} /> : <Copy size={16} />}
            {navigator.share ? 'Compartir link' : 'Copiar link'}
          </button>
        </motion.div>

        {/* Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="heading-medium">Jugadores</h3>
            <span className="text-sm text-muted-foreground">
              {playerCount}/{MAX_ROOM_PLAYERS}
            </span>
          </div>
          <PlayerList players={playersMap} hostUid={meta.hostUid} />
        </motion.div>

        {/* Start button (host only) */}
        {isHost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="btn-primary w-full text-base py-4"
            >
              {playerCount < 2
                ? 'Esperando jugadores...'
                : `Iniciar Peda con ${playerCount} jugadores 🍻`}
            </button>
          </motion.div>
        )}

        {/* Client waiting message */}
        {!isHost && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-muted-foreground body-regular"
          >
            Esperando a que el host inicie la peda...
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default RoomLobby;
