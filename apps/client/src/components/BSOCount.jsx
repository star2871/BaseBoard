import React from 'react';

const BSOCount = ({ state }) => {
  return (
    <div className="flex items-center space-x-6 text-lg">
      <div className="flex items-center space-x-2">
        <span className="text-text-secondary">아웃:</span>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < state.outs ? 'bg-red-500' : 'bg-surface-tertiary'}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-text-secondary">볼:</span>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < state.balls ? 'bg-yellow-500' : 'bg-surface-tertiary'}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-text-secondary">스트라이크:</span>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < state.strikes ? 'bg-green-500' : 'bg-surface-tertiary'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BSOCount;
