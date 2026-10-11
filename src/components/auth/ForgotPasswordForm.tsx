import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AuthError } from 'firebase/auth';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(email);
      setSent(true);
    } catch (err) {
      if ((err as AuthError).code === 'auth/user-not-found') {
        setError('No encontramos esa cuenta');
      } else {
        setError('Error al enviar el correo');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="text-4xl mb-3">📬</div>
        <h3 className="font-semibold text-foreground mb-2">¡Correo enviado!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
        </p>
        <button type="button" onClick={onBack} className="text-primary text-sm hover:underline">
          Volver al login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <p className="text-sm text-muted-foreground">
        Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
      </p>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? 'Enviando…' : 'Enviar link de recuperación'}
      </button>

      <button type="button" onClick={onBack} className="w-full text-center text-sm text-primary hover:underline">
        Volver al login
      </button>
    </motion.form>
  );
};

export default ForgotPasswordForm;
