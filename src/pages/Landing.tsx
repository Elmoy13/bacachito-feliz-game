import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PenLine, Globe } from 'lucide-react';
import Blob from '@/components/Blob';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background Blobs */}
      <Blob className="blob-1" delay={0} />
      <Blob className="blob-2" delay={0.2} />
      <Blob className="blob-3" delay={0.4} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.p
          className="label-uppercase text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Un juego de mesa para adultos
        </motion.p>

        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <img 
            src="/logosinletras.png" 
            alt="Bacachito Feliz" 
            className="w-48 h-48 object-contain"
          />
        </motion.div>

        <motion.h1
          className="heading-display mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Bacachito
          <br />
          <span className="italic">Feliz</span>
        </motion.h1>

        <motion.p
          className="body-elegant text-muted-foreground mb-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          La elegancia de ponerse hasta atrás.
        </motion.p>

        <motion.button
          onClick={() => navigate('/setup')}
          className="btn-editorial"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Iniciar Peda
        </motion.button>

        <motion.button
          onClick={() => navigate('/multiplayer/create')}
          className="btn-ghost mt-4 mx-auto flex items-center gap-2 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Globe size={14} />
          Peda Remota
        </motion.button>

        <motion.button
          onClick={() => navigate('/mis-cartas')}
          className="flex items-center gap-2 mx-auto mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          whileTap={{ scale: 0.98 }}
        >
          <PenLine size={14} />
          Mis cartas personalizadas
        </motion.button>

        <motion.p
          className="body-small text-muted-foreground mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Bebe con responsabilidad. Solo mayores de 18.
        </motion.p>
      </div>
    </div>
  );
};

export default Landing;
