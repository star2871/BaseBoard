import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocketStore from '../store/socketStore';
import useGameStore from '../store/gameStore';
import { Bell, Zap, Radio } from 'lucide-react';
import NextGameWidget from '../components/NextGameWidget';
import TeamRankingsWidget from '../components/TeamRankingsWidget';
import PlayerStatusBoard from '../components/PlayerStatusBoard';

const DashboardPage = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocketStore((state) => state.socket);
  const { liveGame, setLiveGame } = useGameStore();
  const [dashboardError, setDashboardError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveGame = async () => {
      try {
        const response = await fetch('/api/games/live');
        if (response.status === 404) {
          setLiveGame(null);
          return;
        }
        const data = await response.json();
        setLiveGame(data);
      } catch (error) {
        console.error('Error fetching live game on dashboard:', error);
        setDashboardError('실시간 경기 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchLiveGame();
  }, [setLiveGame]);

  useEffect(() => {
    if (socket) {
      const handleFatigueUpdate = (player) => {
        const newNotification = {
          id: player._id + Date.now(),
          message: `[${new Date().toLocaleTimeString()}] ${player.name} 선수의 피로도가 ${player.fatigueLevel} (${player.fatigueScore.toFixed(1)}) 상태입니다.`,
          playerId: player._id,
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      };

      const handleLiveGameUpdate = (updatedGame) => {
        setLiveGame(updatedGame);
      };

      socket.on('player:fatigue:updated', handleFatigueUpdate);
      socket.on('game:live:updated', handleLiveGameUpdate);

      return () => { 
        socket.off('player:fatigue:updated', handleFatigueUpdate); 
        socket.off('game:live:updated', handleLiveGameUpdate); 
      };
    }
  }, [socket, setLiveGame]);

  const handleNotificationClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  return (
    // 대시보드 전체 에러 메시지 표시
    {dashboardError && (
      <div className="p-4 mb-4 text-danger bg-red-900/20 rounded-md">{dashboardError}</div>
    )}
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">대시보드 개요</h1>
      
      {liveGame && (
        <div className="mb-8 animate-in slide-in-from-top duration-500">
          <div className="bg-gradient-to-r from-primary to-indigo-600 p-6 rounded-2xl shadow-xl flex items-center justify-between border border-white/20">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 p-3 rounded-full animate-pulse">
                <Radio className="text-white" size={24} />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">현재 경기 진행 중</span>
                  <span className="flex h-2 w-2 rounded-full bg-danger animate-ping"></span>
                </div>
                <div className="text-2xl font-black text-white flex items-center space-x-4">
                  <span>{liveGame.awayTeam.name}</span>
                  <span className="text-white/60 text-lg">{liveGame.awayScore} : {liveGame.homeScore}</span>
                  <span>{liveGame.homeTeam.name}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/live-game')}
              className="bg-white text-primary px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95"
            >
              상세 보기
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <NextGameWidget />
        <TeamRankingsWidget />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center">선수 상태 보드</h2>
        <div className="bg-surface-secondary rounded-lg border border-border-color">
          <PlayerStatusBoard />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center"><Bell className="mr-2 text-info" /> 실시간 알림</h2>
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
            <p className="text-text-secondary text-center pt-6">실시간 이벤트를 기다리는 중...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;