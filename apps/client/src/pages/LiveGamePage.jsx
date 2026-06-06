import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import useSocketStore from '../store/socketStore';
import Scoreboard from '../components/Scoreboard';
import BSOCount from '../components/BSOCount';
import RunnersOnBase from '../components/RunnersOnBase';
import EventFeed from '../components/EventFeed';
import { ArrowLeft } from 'lucide-react';

const LiveGamePage = () => {
  const { liveGame, setLiveGame } = useGameStore();
  const socket = useSocketStore((state) => state.socket);
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
        console.error('Error fetching live game:', error);
      }
    };
    fetchLiveGame();
  }, [setLiveGame]);

  // 웹소켓을 통한 실시간 경기 데이터 업데이트 구독
  useEffect(() => {
    if (socket) {
      const handleGameUpdate = (updatedGame) => {
        setLiveGame(updatedGame);
      };
      
      socket.on('game:live:updated', handleGameUpdate);
      
      return () => {
        socket.off('game:live:updated', handleGameUpdate);
      };
    }
  }, [socket, setLiveGame]);

  if (!liveGame) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center">
        <div className="bg-surface-secondary p-12 rounded-3xl border border-border-color shadow-xl max-w-md">
          <h2 className="text-3xl font-bold text-text-primary mb-4">현재 진행 중인 경기가 없습니다</h2>
          <p className="text-text-secondary mb-8">다음 경기 일정을 확인해 주세요. 실시간 중계가 시작되면 이곳에서 확인하실 수 있습니다.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition-colors shadow-lg"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-text-secondary hover:text-text-primary transition-colors group"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          <span>대시보드로 돌아가기</span>
        </button>
        <div className="flex items-center space-x-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
          </span>
          <span className="text-sm font-bold text-text-primary uppercase tracking-wider">Live Now</span>
        </div>
      </div>

      <Scoreboard game={liveGame} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-secondary p-8 rounded-2xl border border-border-color shadow-lg">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <span className="w-2 h-6 bg-primary rounded-full mr-3"></span>
              경기 상황
            </h3>
            <div className="flex justify-center items-center py-8">
              <BSOCount state={liveGame.liveState} />
            </div>
          </div>

          <div className="bg-surface-secondary p-8 rounded-2xl border border-border-color shadow-lg">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <span className="w-2 h-6 bg-primary rounded-full mr-3"></span>
              실시간 이벤트 피드
            </h3>
            <EventFeed events={liveGame.realtimeEvents} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-secondary p-8 rounded-2xl border border-border-color shadow-lg">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <span className="w-2 h-6 bg-primary rounded-full mr-3"></span>
              주자 상황
              <div className="ml-auto">
                <div className="text-xs text-text-secondary bg-surface-primary px-2 py-1 rounded">
                  BASE RUNNERS
                </div>
              </div>
            </h3>
            <div className="flex justify-center">
              <RunnersOnBase runners={liveGame.liveState.baseRunners} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGamePage;
