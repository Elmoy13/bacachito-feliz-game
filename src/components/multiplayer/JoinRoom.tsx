import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRoomClient } from '@/hooks/useRoomClient';
import { useRoom } from '@/hooks/useRoom';
import { useUser } from '@/context/UserContext';
import PlayerList from './PlayerList';

const JoinRoom: React.FC = () => {
  const { roomCode: urlCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { uid, loading: authLoading } = useUser();
  const { joinRoom } = useRoomClient();

  const [code, setCode] = useState(urlCode?.toUpperCase() || '');
  const [playerName, setPlayerName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  // Subscribe to room once joined
  const { room, meta, playersMap } = useRoom(joined ? code : undefined);

  // Redirect to game if room starts playing
  useEffect(() => {
    if (joined && meta?.status === 'playing') {
      navigate(`/multiplayer/game/${code}`, { replace: true });
    }
  }, [joined, meta?.status, code, navigate]);

  const canJoin = code.length === 6 && playerName.trim().length >= 2 && !joining;

  const handleJoin = async () => {
    if (!canJoin) return;
    setError(null);
    setJoining(true);
    try {
      const result = await joinRoom(code.toUpperCase(), playerName.trim());
      if (result.success) {
        setJoined(true);
      } else {
        setError(result.error || 'Error al unirse');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setJoining(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  // Waiting screen after joining
  if (joined) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <h1 className="heading-large mb-2">¡Estás dentro! 🍻</h1>
            <p className="body-regular text-muted-foreground">
              Esperando a que el host inicie la peda...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <p className="label-uppercase text-muted-foreground mb-2 text-center">
              Sala: <span className="font-mono font-bold text-foreground">{code}</span>
            </p>
          </motion.div>

          {playersMap && Object.keys(playersMap).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="heading-medium mb-3">Jugadores</h3>
              <PlayerList players={playersMap} hostUid={meta?.hostUid} />
            </motion.div>
          )}

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm">Conectado</span>
            </div>
          </div>
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
          className="mb-8"
        >
          <button onClick={() => navigate('/')} className="btn-ghost -ml-4 mb-6">
            <ArrowLeft size={18} className="mr-2" />
            Volver
          </button>
          <h1 className="heading-large mb-2">Unirse a la peda</h1>
          <p className="body-regular text-muted-foreground">
            Ingresa el código de la sala para unirte.
          </p>
        </motion.div>

        {/* Code input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="label-uppercase text-muted-foreground mb-2 block">
            Código de sala
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="BACA47"
            maxLength={6}
            className="input-editorial w-full text-center text-2xl font-mono tracking-[0.2em] uppercase"
            autoFocus
          />
        </motion.div>

        {/* Name input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <label className="label-uppercase text-muted-foreground mb-2 block">
            Tu nombre
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="¿Cómo te llamas?"
            maxLength={20}
            className="input-editorial w-full"
          />
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleJoin}
            disabled={!canJoin}
            className="btn-primary w-full text-base py-4"
          >
            {joining ? 'Uniéndose...' : 'Unirse a la peda 🍻'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinRoom;
