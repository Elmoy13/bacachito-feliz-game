import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

interface InstagramButtonProps {
  handle?: string;
  url?: string;
  delay?: number;
}

const InstagramButton: React.FC<InstagramButtonProps> = ({
  handle = '@bacachitofeliz',
  url = 'https://instagram.com/bacachitofeliz',
  delay = 0,
}) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:bg-secondary/60 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-foreground"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <Instagram size={16} />
    {handle}
  </motion.a>
);

export default InstagramButton;
