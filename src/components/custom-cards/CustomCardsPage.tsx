import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomCards } from '@/hooks/useCustomCards';
import { useUser } from '@/context/UserContext';
import type { CustomCard, CustomPack } from '@/types/customCards';
import { MAX_CUSTOM_CARDS, MAX_CUSTOM_PACKS } from '@/types/customCards';
import CardList from './CardList';
import PackList from './PackList';
import CommunityTab from './CommunityTab';
import CreateCardModal from './CreateCardModal';
import CreatePackModal from './CreatePackModal';
import { toast } from 'sonner';

type Tab = 'cards' | 'packs' | 'community';

const TABS: { id: Tab; label: string }[] = [
  { id: 'cards', label: 'Mis cartas' },
  { id: 'packs', label: 'Mis packs' },
  { id: 'community', label: 'Comunidad' },
];

const CustomCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useUser();
  const {
    cards,
    packs,
    loading,
    createCard,
    editCard,
    removeCard,
    duplicateCard,
    createPack,
    editPack,
    removePack,
  } = useCustomCards();

  const [activeTab, setActiveTab] = useState<Tab>('cards');
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [packModalOpen, setPackModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CustomCard | null>(null);
  const [editingPack, setEditingPack] = useState<CustomPack | null>(null);

  const handleCreateCard = useCallback(() => {
    if (cards.length >= MAX_CUSTOM_CARDS) {
      toast.error(`Máximo ${MAX_CUSTOM_CARDS} cartas alcanzado`);
      return;
    }
    setEditingCard(null);
    setCardModalOpen(true);
  }, [cards.length]);

  const handleEditCard = useCallback((card: CustomCard) => {
    setEditingCard(card);
    setCardModalOpen(true);
  }, []);

  const handleSaveCard = useCallback(
    async (data: Omit<CustomCard, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (editingCard) {
        await editCard(editingCard.id, data);
      } else {
        await createCard(data);
      }
    },
    [editingCard, editCard, createCard]
  );

  const handleDeleteCard = useCallback(
    async (id: string) => {
      await removeCard(id);
      toast.success('Carta eliminada');
    },
    [removeCard]
  );

  const handleDuplicateCard = useCallback(
    async (id: string) => {
      await duplicateCard(id);
      toast.success('Carta duplicada');
    },
    [duplicateCard]
  );

  const handleCreatePack = useCallback(() => {
    if (packs.length >= MAX_CUSTOM_PACKS) {
      toast.error(`Máximo ${MAX_CUSTOM_PACKS} packs alcanzado`);
      return;
    }
    setEditingPack(null);
    setPackModalOpen(true);
  }, [packs.length]);

  const handleEditPack = useCallback((pack: CustomPack) => {
    setEditingPack(pack);
    setPackModalOpen(true);
  }, []);

  const handleSavePack = useCallback(
    async (data: Omit<CustomPack, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (editingPack) {
        await editPack(editingPack.id, data);
      } else {
        await createPack(data);
      }
    },
    [editingPack, editPack, createPack]
  );

  const handleDeletePack = useCallback(
    async (id: string) => {
      await removePack(id);
      toast.success('Pack eliminado');
    },
    [removePack]
  );

  const isLoading = authLoading || loading;

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button onClick={() => navigate(-1)} className="btn-ghost -ml-4 mb-4">
            <ArrowLeft size={18} className="mr-2" />
            Volver
          </button>
          <h1 className="heading-large mb-1">Mis cartas</h1>
          <p className="body-regular text-muted-foreground">
            Crea y organiza tus propios retos.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-secondary/50 rounded-xl p-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm">Cargando...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'cards' && (
                <CardList
                  cards={cards}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  onDuplicate={handleDuplicateCard}
                  onCreate={handleCreateCard}
                />
              )}
              {activeTab === 'packs' && (
                <PackList
                  packs={packs}
                  cards={cards}
                  onEdit={handleEditPack}
                  onDelete={handleDeletePack}
                  onCreate={handleCreatePack}
                />
              )}
              {activeTab === 'community' && <CommunityTab />}
            </motion.div>
          </AnimatePresence>
        )}

        {/* FAB */}
        {activeTab !== 'community' && !isLoading && (
          <motion.button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-40 shadow-lg"
            onClick={activeTab === 'cards' ? handleCreateCard : handleCreatePack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Plus size={24} />
          </motion.button>
        )}
      </div>

      {/* Modals */}
      <CreateCardModal
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        onSave={handleSaveCard}
        onDelete={editingCard ? () => removeCard(editingCard.id) : undefined}
        packs={packs}
        editingCard={editingCard}
      />
      <CreatePackModal
        isOpen={packModalOpen}
        onClose={() => setPackModalOpen(false)}
        onSave={handleSavePack}
        onDelete={editingPack ? () => removePack(editingPack.id) : undefined}
        editingPack={editingPack}
      />
    </div>
  );
};

export default CustomCardsPage;
