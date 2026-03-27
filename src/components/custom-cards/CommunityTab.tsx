import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { addToWaitlist } from '@/services/customCardsService';
import { trackEvent } from '@/lib/firebase';
import { toast } from 'sonner';

const CommunityTab: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Ingresa un email válido');
      return;
    }
    setSubmitting(true);
    try {
      await addToWaitlist(trimmed);
      trackEvent('community_waitlist_signup');
      setSubmitted(true);
      toast.success('¡Te avisaremos cuando esté listo!');
    } catch {
      toast.error('Error al registrar tu email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="text-5xl mb-4">🍻</span>
      <h3 className="heading-medium mb-2">Próximamente</h3>
      <p className="body-regular text-muted-foreground mb-8 max-w-xs">
        Comparte tus packs y descarga los de otros. ¡La comunidad de Bacachito Feliz viene pronto!
      </p>

      {submitted ? (
        <div className="flex items-center gap-2 text-green-400 font-medium">
          <CheckCircle size={20} />
          <span>¡Registrado! Te avisaremos.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-xs flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="input-modern flex-1 text-sm"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary px-4"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default CommunityTab;
