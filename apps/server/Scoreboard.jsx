import React from 'react';

const Scoreboard = ({ game }) => {
  if (!game) return <div className="p-4 text-center text-gray-500">게임 정보를 불러오는 중...</div>;

  const { homeTeam, awayTeam, homeScore, awayScore, liveState } = game;
  const currentInning = liveState?.currentInning || '경기 준비 중';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
      {/* 이닝 정보 */}
      <div className="inline-block px-4 py-1 bg-primary/10 text-primary font-semibold rounded-full mb-4">
        {currentInning}
      </div>
      
      <div className="flex items-center justify-between w-full max-w-lg">
        {/* 원정팀 (왼쪽) */}
        <div className="flex flex-col items-center flex-1 text-center">
          <span className="text-xl md:text-2xl font-bold text-gray-800">{awayTeam?.name || 'Away'}</span>
        </div>
        
        {/* 점수 (가운데) */}
        <div className="flex items-center justify-center px-4 md:px-8 space-x-3 md:space-x-6">
          <span className="text-4xl md:text-5xl font-black text-gray-900">{awayScore ?? 0}</span>
          <span className="text-2xl text-gray-300 font-bold">-</span>
          <span className="text-4xl md:text-5xl font-black text-gray-900">{homeScore ?? 0}</span>
        </div>

        {/* 홈팀 (오른쪽) */}
        <div className="flex flex-col items-center flex-1 text-center">
          <span className="text-xl md:text-2xl font-bold text-gray-800">{homeTeam?.name || 'Home'}</span>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;