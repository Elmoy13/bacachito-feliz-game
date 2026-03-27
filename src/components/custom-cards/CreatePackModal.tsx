import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { CustomPack } from '@/types/customCards';
import { MAX_PACK_NAME_LENGTH, MIN_PACK_NAME_LENGTH, MAX_PACK_DESCRIPTION_LENGTH } from '@/types/customCards';
import EmojiPicker from './EmojiPicker';
import { toast } from 'sonner';

interface CreatePackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pack: Omit<CustomPack, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDelete?: () => Promise<void>;
  editingPack?: CustomPack | null;
}

const CreatePackModal: React.FC<CreatePackModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingPack,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🍺');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingPack) {
      setName(editingPack.name);
      setDescription(editingPack.description);
      setEmoji(editingPack.emoji);
    } else {
      setName('');
      setDescription('');
      setEmoji('🍺');
    }
  }, [editingPack, isOpen]);

  const isValid = name.trim().length >= MIN_PACK_NAME_LENGTH && name.trim().length <= MAX_PACK_NAME_LENGTH;

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        emoji,
        cardIds: editingPack?.cardIds || [],
      });
      toast.success(editingPack ? 'Pack actualizado 🍻' : '¡Pack creado! 🍻');
      onClose();
    } catch {
      toast.error('Error al guardar el pack');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setSaving(true);
    try {
      await onDelete();
      toast.success('Pack eliminado');
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
                {editingPack ? 'Editar pack' : 'Nuevo pack'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Name */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="label-uppercase text-muted-foreground">Nombre del pack</label>
                <span className="text-xs text-muted-foreground">{name.length}/{MAX_PACK_NAME_LENGTH}</span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Pack de mi grupo de amigos"
                className="input-editorial"
                maxLength={MAX_PACK_NAME_LENGTH}
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="label-uppercase text-muted-foreground">Descripción (opcional)</label>
                <span className="text-xs text-muted-foreground">{description.length}/{MAX_PACK_DESCRIPTION_LENGTH}</span>
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Retos personalizados para las pedas del viernes"
                className="input-modern"
                maxLength={MAX_PACK_DESCRIPTION_LENGTH}
              />
            </div>

            {/* Emoji */}
            <div className="mb-6">
              <label className="label-uppercase text-muted-foreground mb-2 block">Emoji del pack</label>
              <EmojiPicker value={emoji} onChange={setEmoji} />
            </div>

            {/* Preview */}
            <div className="mb-6">
              <label className="label-uppercase text-muted-foreground mb-2 block">Preview</label>
              <div className="rounded-2xl bg-card p-5 border border-border">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{emoji}</span>
                  <div>
                    <h3 className="font-bold text-foreground">{name || 'Nombre del pack'}</h3>
                    <p className="text-sm text-muted-foreground">{description || 'Descripción…'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pb-8">
              <button
                onClick={handleSave}
                disabled={!isValid || saving}
                className="btn-primary w-full py-4"
              >
                {saving ? 'Guardando...' : editingPack ? 'Guardar cambios' : 'Crear pack'}
              </button>
              {editingPack && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="w-full py-3 rounded-2xl text-red-400 font-medium text-sm hover:bg-red-500/10 transition-colors"
                >
                  Eliminar pack
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

export default CreatePackModal;
