import React, { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import { Link } from 'react-router-dom';

const GameCenterPage = () => {
  const { liveGame, setLiveGame } = useGameStore();

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

  if (!liveGame) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="text-2xl font-bold text-text-secondary">현재 진행 중인 경기가 없습니다.</div>
      <p className="text-text-secondary">다음 경기 일정을 확인해 주세요.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">실시간 경기 센터</h1>
      
      {/* Scoreboard Section */}
      <div className="bg-surface-secondary p-8 rounded-2xl shadow-lg flex items-center justify-between border border-surface-tertiary">
        <div className="flex flex-col items-center space-y-4 w-1/3">
          <img src={liveGame.awayTeam.logoUrl} alt={liveGame.awayTeam.name} className="w-24 h-24 object-contain" />
          <span className="text-xl font-bold">{liveGame.awayTeam.name}</span>
        </div>
        
        <div className="flex flex-col items-center space-y-2 w-1/3">
          <div className="text-6xl font-black flex space-x-4">
            <span>{liveGame.awayScore}</span>
            <span className="text-surface-tertiary">:</span>
            <span>{liveGame.homeScore}</span>
          </div>
          <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
            {liveGame.liveState.currentInning}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4 w-1/3">
          <img src={liveGame.homeTeam.logoUrl} alt={liveGame.homeTeam.name} className="w-24 h-24 object-contain" />
          <span className="text-xl font-bold">{liveGame.homeTeam.name}</span>
        </div>
      </div>

      {/* Live Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-secondary p-6 rounded-2xl border border-surface-tertiary">
          <h2 className="text-xl font-bold mb-4">경기 상황</h2>
          <div className="flex items-center space-x-6 text-lg">
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary">아웃:</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${i < liveGame.liveState.outs ? 'bg-red-500' : 'bg-surface-tertiary'}`} />
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary">볼:</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${i < liveGame.liveState.balls ? 'bg-yellow-500' : 'bg-surface-tertiary'}`} />
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary">스트라이크:</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${i < liveGame.liveState.strikes ? 'bg-green-500' : 'bg-surface-tertiary'}`} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Base Runners */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-48 h-48 border-2 border-surface-tertiary rounded-lg rotate-45">
              <BaseRunner pos="first" active={liveGame.liveState.baseRunners.first} />
              <BaseRunner pos="second" active={liveGame.liveState.baseRunners.second} />
              <BaseRunner pos="third" active={liveGame.liveState.baseRunners.third} />
            </div>
          </div>
        </div>

        <div className="bg-surface-secondary p-6 rounded-2xl border border-surface-tertiary">
          <h2 className="text-xl font-bold mb-4">실시간 이벤트</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {liveGame.realtimeEvents && liveGame.realtimeEvents.length > 0 ? (
              liveGame.realtimeEvents.map((event, idx) => (
                <div key={idx} className="p-3 bg-surface-primary rounded-lg border-l-4 border-primary flex justify-between items-center">
                  <span>{event.description}</span>
                  <span className="text-xs text-text-secondary">{event.inning}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-text-secondary py-4">이벤트가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BaseRunner = ({ pos, active }) => {
  const positions = {
    first: { bottom: '20px', right: '20px' },
    second: { top: '20px', right: '20px' },
    third: { top: '20px', left: '20px' },
  };

  return (
    <div 
      className={`absolute w-6 h-6 rounded-full ${active ? 'bg-primary shadow-lg scale-110' : 'bg-surface-tertiary'} transition-all duration-300`}
      style={positions[pos] || {}}
    />
  );
};

export default GameCenterPage;
