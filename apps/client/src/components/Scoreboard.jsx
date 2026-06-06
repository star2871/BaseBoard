import React from 'react';

const Scoreboard = ({ game }) => {
  return (
    <div className="bg-surface-secondary p-8 rounded-2xl shadow-xl flex items-center justify-between border border-border-color">
      <div className="flex flex-col items-center space-y-4 w-1/3">
        <div className="bg-surface-primary p-2 rounded-full shadow-inner">
          <img src={game.awayTeam.logoUrl} alt={game.awayTeam.name} className="w-24 h-24 object-contain" />
        </div>
        <span className="text-xl font-bold text-text-primary">{game.awayTeam.name}</span>
      </div>
      
      <div className="flex flex-col items-center space-y-4 w-1/3">
        <div className="text-7xl font-black flex space-x-6 text-white tabular-nums">
          <span>{game.awayScore}</span>
          <span className="text-border-color">:</span>
          <span>{game.homeScore}</span>
        </div>
        <div className="bg-primary text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-md">
          {game.liveState.currentInning}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 w-1/3">
        <div className="bg-surface-primary p-2 rounded-full shadow-inner">
          <img src={game.homeTeam.logoUrl} alt={game.homeTeam.name} className="w-24 h-24 object-contain" />
        </div>
        <span className="text-xl font-bold text-text-primary">{game.homeTeam.name}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
