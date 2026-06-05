import React from 'react';

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

const RunnersOnBase = ({ runners }) => {
  return (
    <div className="mt-8 flex justify-center">
      <div className="relative w-48 h-48 border-2 border-surface-tertiary rounded-lg rotate-45">
        <BaseRunner pos="first" active={runners.first} />
        <BaseRunner pos="second" active={runners.second} />
        <BaseRunner pos="third" active={runners.third} />
      </div>
    </div>
  );
};

export default RunnersOnBase;
