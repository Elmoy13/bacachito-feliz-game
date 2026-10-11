import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { AuthError } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import BacachitoLogo from '@/components/BacachitoLogo';
import GoogleButton from './GoogleButton';
import AuthDivider from './AuthDivider';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthView = 'login' | 'register' | 'forgot';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } =
    useAuth();
  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = useCallback(async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getAuthErrorMessage(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [signInWithGoogle]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        await signInWithEmail(email, password);
      } catch (err) {
        setError(getAuthErrorMessage((err as AuthError).code));
        throw err;
      }
    },
    [signInWithEmail]
  );

  const handleRegister = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        await signUpWithEmail(email, password);
      } catch (err) {
        setError(getAuthErrorMessage((err as AuthError).code));
        throw err;
      }
    },
    [signUpWithEmail]
  );

  const handleForgot = useCallback(
    async (email: string) => {
      await resetPassword(email);
    },
    [resetPassword]
  );

  const switchView = (next: AuthView) => {
    setError(null);
    setView(next);
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="auth-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Sheet */}
      <motion.div
        key="auth-modal"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-8" />
              <div className="flex flex-col items-center">
                <BacachitoLogo size="sm" animate />
              </div>
              <button
                onClick={closeAuthModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-center text-foreground mb-1">
              Inicia sesión para desbloquear todo
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Accede a modos premium, multijugador y más
            </p>

            <GoogleButton onClick={handleGoogle} loading={googleLoading} />

            <AuthDivider />

            <AnimatePresence mode="wait">
              {view === 'login' && (
                <LoginForm
                  key="login"
                  onSubmit={handleLogin}
                  onForgotPassword={() => switchView('forgot')}
                  onSwitchToRegister={() => switchView('register')}
                  error={error}
                />
              )}
              {view === 'register' && (
                <RegisterForm
                  key="register"
                  onSubmit={handleRegister}
                  onSwitchToLogin={() => switchView('login')}
                  error={error}
                />
              )}
              {view === 'forgot' && (
                <ForgotPasswordForm key="forgot" onSubmit={handleForgot} onBack={() => switchView('login')} />
              )}
            </AnimatePresence>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Bebe con responsabilidad. Solo mayores de 18.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales incorrectas',
    'auth/user-not-found': 'No encontramos esa cuenta',
    'auth/credential-already-in-use': 'Esta cuenta ya está vinculada. Intenta iniciar sesión directamente.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
    'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
    'auth/invalid-email': 'Email no válido',
  };
  return messages[code] || 'Ocurrió un error. Intenta de nuevo.';
}

export default AuthModal;
