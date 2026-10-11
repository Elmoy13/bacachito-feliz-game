import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, ExternalLink, LogOut } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '@/context/AuthContext';
import { functions } from '@/lib/firebase';
import PremiumBadge from '@/components/premium/PremiumBadge';

const PLAN_LABELS: Record<string, string> = {
  daily: 'Pase 1 día',
  weekly: 'Pase 1 semana',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  yearly: 'Anual',
  lifetime: 'De por vida',
};

const UserMenu: React.FC = () => {
  const { user, isAnonymous, isPremium, premiumPlan, premiumExpiresAt, uid, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (isAnonymous || !user) return null;

  const photoURL = user.photoURL;
  const displayName = user.displayName || user.email || '';
  const initials = getInitials(displayName);

  const handleManageSubscription = async () => {
    if (!uid) return;
    setPortalLoading(true);
    try {
      const createPortalSession = httpsCallable<{ uid: string; returnUrl: string }, { url: string }>(
        functions,
        'createPortalSession'
      );
      const { data } = await createPortalSession({
        uid,
        returnUrl: window.location.href,
      });
      window.location.href = data.url;
    } catch {
      // Portal is non-critical
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  return (
    <div ref={menuRef} className="relative z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-border hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {photoURL ? (
          <img src={photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            {initials}
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-popover shadow-xl p-3"
          >
            {/* User info */}
            <div className="flex items-center gap-3 px-1 pb-3">
              {photoURL ? (
                <img src={photoURL} alt="" className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{user.displayName || user.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isPremium ? (
                    <PremiumBadge />
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Gratis
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Plan info */}
            {isPremium && premiumPlan && (
              <div className="border-t border-border pt-2 pb-1 px-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Crown size={12} className="text-amber-500" />
                  <span>Plan: {PLAN_LABELS[premiumPlan]}</span>
                </div>
                {premiumExpiresAt && (
                  <p className="text-[11px] text-muted-foreground/70 ml-5 mt-0.5">
                    Hasta {premiumExpiresAt.toLocaleDateString('es-MX')}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-border mt-2 pt-2 space-y-0.5">
              {isPremium && ['monthly', 'quarterly', 'yearly'].includes(premiumPlan || '') && (
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink size={14} className="text-muted-foreground" />
                  {portalLoading ? 'Abriendo…' : 'Gestionar suscripción'}
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getInitials(name: string): string {
  if (!name) return '?';
  if (name.includes('@')) return name[0].toUpperCase();
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
}

export default UserMenu;
