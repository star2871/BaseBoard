import React from 'react';

const BSOCount = ({ state }) => {
  return (
    <div className="flex items-center space-x-8 text-lg font-medium">
      <div className="flex items-center space-x-3">
        <span className="text-text-secondary">아웃</span>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < state.outs ? 'bg-danger shadow-sm scale-110' : 'bg-surface-tertiary'}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-text-secondary">볼</span>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < state.balls ? 'bg-warning shadow-sm scale-110' : 'bg-surface-tertiary'}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-text-secondary">스트라이크</span>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < state.strikes ? 'bg-success shadow-sm scale-110' : 'bg-surface-tertiary'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BSOCount;
