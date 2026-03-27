import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react';
import PlayerInput from '@/components/PlayerInput';
import { useGame } from '@/context/GameContext';
import { useCustomCards } from '@/hooks/useCustomCards';
import CustomCardsSection from '@/components/custom-cards/CustomCardsSection';
import RegionSelector from '@/components/setup/RegionSelector';
import RegionPreviewCard from '@/components/setup/RegionPreviewCard';
import Bacachito from '@/components/bacachito/Bacachito';
import { REGIONS } from '@/types/slang';

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { players, startGame, gameModes, selectedMode, selectMode, customCardsConfig, setCustomCardsConfig, slangRegion, setSlangRegion } = useGame();
  const { cards } = useCustomCards();
  const [regionOpen, setRegionOpen] = useState(false);
  const regionInfo = REGIONS.find((r) => r.id === slangRegion);

  const handleStartGame = () => {
    if (players.length >= 2 && selectedMode) {
      // Update config with latest cards before starting
      setCustomCardsConfig({ ...customCardsConfig, cards });
      startGame();
      navigate('/game');
    }
  };

  const canStart = players.length >= 2 && selectedMode;

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-ghost -ml-4 mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-large mb-2">
                Arma tu peda
              </h1>
              <p className="body-regular text-muted-foreground">
                Agrega jugadores y elige el modo de juego.
              </p>
            </div>
            <Bacachito
              mood={players.length >= 4 ? 'excited' : 'happy'}
              size="sm"
              position="inline"
              showSpeech={false}
            />
          </div>
        </motion.div>

        {/* Players Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="heading-medium mb-4">
            Jugadores
          </h2>
          <PlayerInput />
          {players.length === 1 && (
            <p className="body-small text-muted-foreground mt-3">
              Agrega al menos un jugador más.
            </p>
          )}
        </motion.section>

        {/* Game Mode Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <h2 className="heading-medium mb-4">
            Modo de juego
          </h2>
          <div className="grid gap-3">
            {gameModes.map((mode, index) => {
              const IconComponent = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  onClick={() => selectMode(mode.id)}
                  className={`card-mode flex items-center gap-4 text-left w-full ${
                    selectedMode?.id === mode.id ? 'selected' : ''
                  }`}
                >
                  <div className={`mode-icon ${mode.bgColor}`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{mode.name}</h3>
                    <p className="body-small text-muted-foreground">{mode.description}</p>
                  </div>
                  {selectedMode?.id === mode.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Slang Region Selection (collapsible) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <button
            onClick={() => setRegionOpen(!regionOpen)}
            className="w-full flex items-center justify-between py-2 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{regionInfo?.emoji}</span>
              <div className="text-left">
                <h2 className="heading-medium">Slang: {regionInfo?.name}</h2>
                <p className="body-small text-muted-foreground">
                  Toca para cambiar la región
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: regionOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {regionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <RegionSelector selected={slangRegion} onSelect={(r) => { setSlangRegion(r); setRegionOpen(false); }} />
                  <RegionPreviewCard
                    region={slangRegion}
                    playerName={players[0]?.name}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Custom Cards Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <CustomCardsSection
            enabled={customCardsConfig.enabled}
            onToggle={(enabled) => setCustomCardsConfig({ ...customCardsConfig, enabled })}
            selectedPackIds={customCardsConfig.selectedPackIds}
            onPackToggle={(packId) => {
              const ids = customCardsConfig.selectedPackIds.includes(packId)
                ? customCardsConfig.selectedPackIds.filter((id) => id !== packId)
                : [...customCardsConfig.selectedPackIds, packId];
              setCustomCardsConfig({ ...customCardsConfig, selectedPackIds: ids });
            }}
            includeNoPack={customCardsConfig.includeNoPack}
            onIncludeNoPackToggle={(val) => setCustomCardsConfig({ ...customCardsConfig, includeNoPack: val })}
            customCardCount={customCardsConfig.customCardCount}
            onCustomCardCountChange={(count) => setCustomCardsConfig({ ...customCardsConfig, customCardCount: count })}
            selectedModeId={selectedMode?.id || null}
          />
        </motion.section>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleStartGame}
            disabled={!canStart}
            className="btn-primary w-full text-base py-4"
          >
            {!selectedMode 
              ? 'Elige un modo' 
              : players.length < 2 
                ? 'Faltan jugadores' 
                : `Empezar con ${players.length} jugadores`
            }
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Setup;
