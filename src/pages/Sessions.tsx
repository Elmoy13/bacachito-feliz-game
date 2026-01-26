import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Gamepad2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GameSession {
  id: string;
  players: string[];
  gameMode: string;
  startedAt: any;
}

const Sessions: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionsQuery = query(
          collection(db, 'gameSessions'),
          orderBy('startedAt', 'desc')
        );
        const querySnapshot = await getDocs(sessionsQuery);
        
        const sessionsData: GameSession[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sessionsData.push({
            id: doc.id,
            players: data.players || [],
            gameMode: data.gameMode || 'Desconocido',
            startedAt: data.startedAt,
          });
        });
        
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error al cargar las partidas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'Fecha desconocida';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-ghost -ml-4 mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver
          </button>

          <h1 className="heading-large mb-2">
            Partidas Jugadas
          </h1>
          <p className="body-regular text-muted-foreground">
            Historial de todas las partidas iniciadas
          </p>
        </motion.div>

        {/* Sessions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando partidas...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No hay partidas registradas aún</p>
            </div>
          ) : (
            sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Gamepad2 size={20} className="text-primary" />
                    <span className="font-semibold">{session.gameMode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>{formatDate(session.startedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {session.players.map((player, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                      >
                        {player}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  ID: {session.id}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
