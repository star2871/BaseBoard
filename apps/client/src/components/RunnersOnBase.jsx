import React from 'react';

const Base = ({ active, label }) => {
  return (
    <div
      className={`w-12 h-12 transform rotate-45 flex items-center justify-center border-4 ${
        active 
          ? 'bg-primary border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.6)]' 
          : 'bg-surface-secondary border-surface-tertiary'
      } transition-all duration-300 z-10`}
    >
      <div className="transform -rotate-45 text-xs font-bold text-white">
        {active && label}
      </div>
    </div>
  );
};

const RunnersOnBase = ({ runners = { first: false, second: false, third: false } }) => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center mt-4">
      {/* 2루 (상단) */}
      <div className="absolute top-0">
        <Base active={runners.second} label="2B" />
      </div>
      {/* 3루 (좌측) */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <Base active={runners.third} label="3B" />
      </div>
      {/* 1루 (우측) */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <Base active={runners.first} label="1B" />
      </div>
      
      {/* 베이스를 잇는 다이아몬드 선 */}
      <div className="absolute inset-0 m-auto w-32 h-32 border-2 border-surface-tertiary transform rotate-45"></div>
    </div>
  );
};

export default RunnersOnBase;