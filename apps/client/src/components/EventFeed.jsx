import React from 'react';

const EventFeed = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center text-text-secondary bg-surface-primary rounded-xl border border-border-color">
        아직 기록된 이벤트가 없습니다. 경기 시작을 기다려주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {events.map((event, index) => (
        <div 
          key={index} 
          className="p-4 bg-surface-primary rounded-xl border-l-4 border-primary flex justify-between items-center shadow-sm"
        >
          <span className="font-medium text-text-primary">{event.description}</span>
          <span className="text-sm font-bold text-text-secondary bg-surface-secondary px-3 py-1 rounded-full">
            {event.inning}
          </span>
        </div>
      ))}
    </div>
  );
};

export default EventFeed;