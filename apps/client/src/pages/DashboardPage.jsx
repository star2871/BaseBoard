import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocketStore from '../store/socketStore';
import { Bell, Zap } from 'lucide-react';
import NextGameWidget from '../components/widgets/NextGameWidget';
import TeamRankingsWidget from '../components/widgets/TeamRankingsWidget';
import PlayerStatusBoard from '../components/PlayerStatusBoard';

const DashboardPage = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocketStore((state) => state.socket);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      const handleFatigueUpdate = (player) => {
        const newNotification = {
          id: player._id + Date.now(),
          message: `[${new Date().toLocaleTimeString()}] Player ${player.name}'s fatigue is now ${player.fatigueLevel} (${player.fatigueScore.toFixed(1)})`,
          playerId: player._id,
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      };

      socket.on('player:fatigue:updated', handleFatigueUpdate);

      return () => { socket.off('player:fatigue:updated', handleFatigueUpdate); };
    }
  }, [socket]);

  const handleNotificationClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <NextGameWidget />
        <TeamRankingsWidget />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center">Player Status Board</h2>
        <div className="bg-surface-secondary rounded-lg border border-border-color">
          <PlayerStatusBoard />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center"><Bell className="mr-2 text-info" /> Real-time Notifications</h2>
        <div className="p-4 bg-surface-secondary rounded-lg border border-border-color min-h-[120px]">
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((note) => (
                <li key={note.id} className="text-sm text-text-secondary flex items-start cursor-pointer hover:bg-gray-700 p-1 rounded-md transition-colors" onClick={() => handleNotificationClick(note.playerId)}>
                  <Zap size={14} className="mr-2 mt-1 text-warning flex-shrink-0" /> {note.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary text-center pt-6">Waiting for real-time events...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;