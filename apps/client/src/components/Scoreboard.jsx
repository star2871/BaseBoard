import React from 'react';

const Scoreboard = ({ game }) => {
  return (
    <div className="bg-surface-secondary p-8 rounded-2xl shadow-lg flex items-center justify-between border border-surface-tertiary">
      <div className="flex flex-col items-center space-y-4 w-1/3">
        <img src={game.awayTeam.logoUrl} alt={game.awayTeam.name} className="w-24 h-24 object-contain" />
        <span className="text-xl font-bold">{game.awayTeam.name}</span>
      </div>
      
      <div className="flex flex-col items-center space-y-2 w-1/3">
        <div className="text-6xl font-black flex space-x-4">
          <span>{game.awayScore}</span>
          <span className="text-surface-tertiary">:</span>
          <span>{game.homeScore}</span>
        </div>
        <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
          {game.liveState.currentInning}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 w-1/3">
        <img src={game.homeTeam.logoUrl} alt={game.homeTeam.name} className="w-24 h-24 object-contain" />
        <span className="text-xl font-bold">{game.homeTeam.name}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
