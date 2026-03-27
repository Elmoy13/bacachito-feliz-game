import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { gameModes } from '@/data/challenges';
import { useRoomHost } from '@/hooks/useRoomHost';
import { useUser } from '@/context/UserContext';
import RegionSelector from '@/components/setup/RegionSelector';
import RegionPreviewCard from '@/components/setup/RegionPreviewCard';
import type { SlangRegion } from '@/types/slang';
import { DEFAULT_REGION, SLANG_STORAGE_KEY } from '@/types/slang';

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useUser();
  const { createRoom } = useRoomHost();
  const [hostName, setHostName] = useState('');
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [slangRegion, setSlangRegion] = useState<SlangRegion>(() => {
    try { return (localStorage.getItem(SLANG_STORAGE_KEY) as SlangRegion) || DEFAULT_REGION; } catch { return DEFAULT_REGION; }
  });

  const canCreate = hostName.trim().length >= 2 && selectedModeId && !creating;

  const handleCreate = async () => {
    if (!canCreate) return;
    setCreating(true);
    try {
      const code = await createRoom(hostName.trim(), selectedModeId!, slangRegion);
      navigate(`/multiplayer/lobby/${code}`);
    } catch (err) {
      console.error('Error creating room:', err);
      setCreating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
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
          <h1 className="heading-large mb-2">Peda Remota 🌐</h1>
          <p className="body-regular text-muted-foreground">
            Crea una sala y comparte el código con tus amigos.
          </p>
        </motion.div>

        {/* Host name */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="heading-medium mb-3">Tu nombre</h2>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="¿Cómo te llamas?"
            maxLength={20}
            className="input-editorial w-full"
            autoFocus
          />
        </motion.section>

        {/* Mode selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="heading-medium mb-4">Modo de juego</h2>
          <div className="grid gap-3">
            {gameModes.map((mode, index) => {
              const IconComponent = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onClick={() => setSelectedModeId(mode.id)}
                  className={`card-mode flex items-center gap-4 text-left w-full ${
                    selectedModeId === mode.id ? 'selected' : ''
                  }`}
                >
                  <div className={`mode-icon ${mode.bgColor}`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{mode.name}</h3>
                    <p className="body-small text-muted-foreground">{mode.description}</p>
                  </div>
                  {selectedModeId === mode.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Slang Region */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-10"
        >
          <RegionSelector selected={slangRegion} onSelect={setSlangRegion} />
          <RegionPreviewCard region={slangRegion} playerName={hostName || undefined} />
        </motion.section>

        {/* Create button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="btn-primary w-full text-base py-4"
          >
            {creating ? 'Creando sala...' : 'Crear sala 🍻'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRoom;
