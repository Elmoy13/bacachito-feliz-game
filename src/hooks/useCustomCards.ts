import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import type { CustomCard, CustomPack } from '@/types/customCards';
import { trackEvent } from '@/lib/firebase';
import {
  subscribeToCustomCards,
  subscribeToCustomPacks,
  addCustomCard,
  updateCustomCard,
  deleteCustomCard,
  addCustomPack,
  updateCustomPack,
  deleteCustomPack,
} from '@/services/customCardsService';

export const useCustomCards = () => {
  const { uid } = useUser();
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [packs, setPacks] = useState<CustomPack[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to cards and packs
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let cardsLoaded = false;
    let packsLoaded = false;
    const checkDone = () => {
      if (cardsLoaded && packsLoaded) setLoading(false);
    };

    const unsubCards = subscribeToCustomCards(
      uid,
      (data) => { setCards(data); cardsLoaded = true; checkDone(); },
      (err) => { console.error('Cards subscription error:', err); cardsLoaded = true; checkDone(); }
    );

    const unsubPacks = subscribeToCustomPacks(
      uid,
      (data) => { setPacks(data); packsLoaded = true; checkDone(); },
      (err) => { console.error('Packs subscription error:', err); packsLoaded = true; checkDone(); }
    );

    return () => { unsubCards(); unsubPacks(); };
  }, [uid]);

  const createCard = useCallback(
    async (card: Omit<CustomCard, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!uid) throw new Error('Not authenticated');
      const id = await addCustomCard(uid, card);
      trackEvent('custom_card_created', {
        card_type: card.type,
        intensity: card.intensity,
        has_pack: !!card.packId,
      });
      return id;
    },
    [uid]
  );

  const editCard = useCallback(
    async (id: string, updates: Partial<CustomCard>) => {
      if (!uid) throw new Error('Not authenticated');
      await updateCustomCard(uid, id, updates);
    },
    [uid]
  );

  const removeCard = useCallback(
    async (id: string) => {
      if (!uid) throw new Error('Not authenticated');
      await deleteCustomCard(uid, id);
      trackEvent('custom_card_deleted');
    },
    [uid]
  );

  const duplicateCard = useCallback(
    async (id: string) => {
      if (!uid) throw new Error('Not authenticated');
      const original = cards.find((c) => c.id === id);
      if (!original) throw new Error('Card not found');
      const { id: _id, createdAt, updatedAt, ...rest } = original;
      return createCard(rest);
    },
    [uid, cards, createCard]
  );

  const createPack = useCallback(
    async (pack: Omit<CustomPack, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!uid) throw new Error('Not authenticated');
      const id = await addCustomPack(uid, pack);
      trackEvent('custom_pack_created', {
        card_count: pack.cardIds.length,
        emoji: pack.emoji,
      });
      return id;
    },
    [uid]
  );

  const editPack = useCallback(
    async (id: string, updates: Partial<CustomPack>) => {
      if (!uid) throw new Error('Not authenticated');
      await updateCustomPack(uid, id, updates);
    },
    [uid]
  );

  const removePack = useCallback(
    async (id: string) => {
      if (!uid) throw new Error('Not authenticated');
      await deleteCustomPack(uid, id);
    },
    [uid]
  );

  const getCardsByPack = useCallback(
    (packId: string): CustomCard[] => cards.filter((c) => c.packId === packId),
    [cards]
  );

  const getCardsWithoutPack = useCallback(
    (): CustomCard[] => cards.filter((c) => !c.packId),
    [cards]
  );

  return {
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
    getCardsByPack,
    getCardsWithoutPack,
  };
};
