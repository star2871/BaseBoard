import React from 'react';

// 신호등 형태의 동그라미를 그리는 내부 컴포넌트
const IndicatorRow = ({ label, max, count, activeColor }) => {
  return (
    <div className="flex items-center justify-between w-full mb-2 last:mb-0">
      <span className="text-lg font-extrabold text-gray-700 w-6">{label}</span>
      <div className="flex space-x-2">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 ${
              i < count ? activeColor : 'bg-transparent border-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const BSOCount = ({ balls = 0, strikes = 0, outs = 0 }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center inline-block min-w-[120px]">
      <IndicatorRow label="B" max={3} count={balls} activeColor="bg-green-500 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
      <IndicatorRow label="S" max={2} count={strikes} activeColor="bg-yellow-400 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
      <IndicatorRow label="O" max={2} count={outs} activeColor="bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
    </div>
  );
};

export default BSOCount;