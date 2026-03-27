import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { ChallengeType } from '@/types/game';
import type { CustomCard, CustomPack, CardIntensity, CardProbability } from '@/types/customCards';
import {
  MAX_CARD_TEXT_LENGTH,
  MIN_CARD_TEXT_LENGTH,
  TIMER_OPTIONS,
  POWER_TYPES,
  TYPE_PLACEHOLDERS,
  GAME_MODE_OPTIONS,
  PROBABILITY_LABELS,
} from '@/types/customCards';
import TypeSelector from './TypeSelector';
import IntensitySelector from './IntensitySelector';
import PlayerVarButtons from './PlayerVarButtons';
import CardPreview from './CardPreview';
import { toast } from 'sonner';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<CustomCard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDelete?: () => Promise<void>;
  packs: CustomPack[];
  editingCard?: CustomCard | null;
}

const CreateCardModal: React.FC<CreateCardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  packs,
  editingCard,
}) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<ChallengeType>('direct');
  const [intensity, setIntensity] = useState<CardIntensity>(2);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [powerType, setPowerType] = useState<string>('ESCUDO');
  const [customPowerType, setCustomPowerType] = useState('');
  const [packId, setPackId] = useState<string>('');
  const [modes, setModes] = useState<string[]>([]);
  const [probability, setProbability] = useState<CardProbability>(2);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const allModesSelected = modes.length === 0;

  const toggleMode = (modeId: string) => {
    setModes((prev) => {
      if (prev.includes(modeId)) {
        return prev.filter((id) => id !== modeId);
      }
      return [...prev, modeId];
    });
  };

  // Populate form when editing
  useEffect(() => {
    if (editingCard) {
      setText(editingCard.text);
      setType(editingCard.type);
      setIntensity(editingCard.intensity);
      setTimerSeconds(editingCard.timerSeconds || 60);
      const pt = editingCard.powerType || 'ESCUDO';
      if (POWER_TYPES.includes(pt)) {
        setPowerType(pt);
        setCustomPowerType('');
      } else {
        setPowerType('CUSTOM');
        setCustomPowerType(pt);
      }
      setPackId(editingCard.packId || '');
      setModes(editingCard.modes || []);
      setProbability(editingCard.probability || 2);
    } else {
      setText('');
      setType('direct');
      setIntensity(2);
      setTimerSeconds(60);
      setPowerType('ESCUDO');
      setCustomPowerType('');
      setPackId('');
      setModes([]);
      setProbability(2);
    }
  }, [editingCard, isOpen]);

  const insertVariable = useCallback((variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText((prev) => prev + variable);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.slice(0, start) + variable + text.slice(end);
    setText(newText);
    // Restore cursor position after React re-render
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      textarea.focus();
    });
  }, [text]);

  const showPlayerWarning = type === 'direct' && text.length >= MIN_CARD_TEXT_LENGTH && !text.includes('{player}');

  const isValid =
    text.length >= MIN_CARD_TEXT_LENGTH &&
    text.length <= MAX_CARD_TEXT_LENGTH &&
    (type !== 'timed' || timerSeconds > 0) &&
    (type !== 'power' || powerType !== 'CUSTOM' || customPowerType.trim().length > 0);

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      const resolvedPowerType = powerType === 'CUSTOM' ? customPowerType.trim() : powerType;
      await onSave({
        text: text.trim(),
        type,
        intensity,
        probability,
        ...(modes.length > 0 ? { modes } : {}),
        ...(type === 'timed' ? { timerSeconds } : {}),
        ...(type === 'power' ? { powerType: resolvedPowerType } : {}),
        ...(packId ? { packId } : {}),
      });
      toast.success(editingCard ? 'Carta actualizada 🍻' : '¡Carta creada! 🍻');
      onClose();
    } catch (err) {
      toast.error('Error al guardar la carta');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setSaving(true);
    try {
      await onDelete();
      toast.success('Carta eliminada');
      onClose();
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-background overflow-y-auto"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div className="max-w-md mx-auto px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-medium">
                {editingCard ? 'Editar carta' : 'Nueva carta'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Type selector */}
            <div className="mb-5">
              <label className="label-uppercase text-muted-foreground mb-2 block">Tipo de carta</label>
              <TypeSelector value={type} onChange={setType} />
            </div>

            {/* Text */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="label-uppercase text-muted-foreground">Texto del reto</label>
                <span className={`text-xs font-medium ${text.length > MAX_CARD_TEXT_LENGTH ? 'text-red-400' : 'text-muted-foreground'}`}>
                  {text.length}/{MAX_CARD_TEXT_LENGTH}
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={TYPE_PLACEHOLDERS[type]}
                rows={4}
                className="input-editorial resize-none"
                maxLength={MAX_CARD_TEXT_LENGTH + 10}
              />
              <div className="mt-2">
                <PlayerVarButtons onInsert={insertVariable} />
              </div>
              {showPlayerWarning && (
                <div className="flex items-center gap-2 mt-2 text-amber-400 text-xs">
                  <AlertTriangle size={14} />
                  <span>Las cartas "Directo" suelen incluir {'{player}'}</span>
                </div>
              )}
            </div>

            {/* Intensity */}
            <div className="mb-5">
              <label className="label-uppercase text-muted-foreground mb-2 block">Intensidad</label>
              <IntensitySelector value={intensity} onChange={setIntensity} />
            </div>

            {/* Game modes */}
            <div className="mb-5">
              <label className="label-uppercase text-muted-foreground mb-2 block">Modos de juego</label>
              <p className="text-xs text-muted-foreground mb-2">
                {allModesSelected ? 'Aparece en todos los modos' : `Aparece en ${modes.length} modo${modes.length !== 1 ? 's' : ''}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setModes([])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    allModesSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  🌐 Todos
                </button>
                {GAME_MODE_OPTIONS.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => toggleMode(mode.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      modes.includes(mode.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {mode.emoji} {mode.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Probability */}
            <div className="mb-5">
              <label className="label-uppercase text-muted-foreground mb-2 block">Probabilidad de aparición</label>
              <div className="flex gap-2">
                {([1, 2, 3] as CardProbability[]).map((p) => {
                  const info = PROBABILITY_LABELS[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProbability(p)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all text-center ${
                        probability === p
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      <span className="block text-base">{info.emoji}</span>
                      <span className="block text-xs mt-0.5">{info.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                {PROBABILITY_LABELS[probability].description}
              </p>
            </div>

            {/* Timer (conditional) */}
            {type === 'timed' && (
              <motion.div className="mb-5" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="label-uppercase text-muted-foreground mb-2 block">Duración del timer</label>
                <div className="flex gap-2">
                  {TIMER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTimerSeconds(opt.value)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        timerSeconds === opt.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Power type (conditional) */}
            {type === 'power' && (
              <motion.div className="mb-5" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="label-uppercase text-muted-foreground mb-2 block">Tipo de poder</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {POWER_TYPES.map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setPowerType(pt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        powerType === pt
                          ? 'bg-purple-500 text-white'
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPowerType('CUSTOM')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      powerType === 'CUSTOM'
                        ? 'bg-purple-500 text-white'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    OTRO
                  </button>
                </div>
                {powerType === 'CUSTOM' && (
                  <input
                    type="text"
                    value={customPowerType}
                    onChange={(e) => setCustomPowerType(e.target.value)}
                    placeholder="Nombre del poder"
                    className="input-modern text-sm"
                    maxLength={20}
                  />
                )}
              </motion.div>
            )}

            {/* Pack selector */}
            <div className="mb-6">
              <label className="label-uppercase text-muted-foreground mb-2 block">Pack (opcional)</label>
              <select
                value={packId}
                onChange={(e) => setPackId(e.target.value)}
                className="input-modern text-sm"
              >
                <option value="">Sin pack</option>
                {packs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live preview */}
            <div className="mb-6">
              <label className="label-uppercase text-muted-foreground mb-2 block">Preview</label>
              <CardPreview
                text={text || TYPE_PLACEHOLDERS[type]}
                type={type}
                intensity={intensity}
                isExtreme={type === 'extreme'}
                isPower={type === 'power'}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pb-8">
              <button
                onClick={handleSave}
                disabled={!isValid || saving}
                className="btn-primary w-full py-4"
              >
                {saving ? 'Guardando...' : editingCard ? 'Guardar cambios' : 'Guardar carta'}
              </button>
              {editingCard && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="w-full py-3 rounded-2xl text-red-400 font-medium text-sm hover:bg-red-500/10 transition-colors"
                >
                  Eliminar carta
                </button>
              )}
              <button onClick={onClose} className="btn-ghost w-full">
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCardModal;
