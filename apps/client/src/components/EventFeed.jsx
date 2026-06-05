import React from 'react';

const EventFeed = ({ events }) => {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {events && events.length > 0 ? (
        events.map((event, idx) => (
          <div key={idx} className="p-3 bg-surface-primary rounded-lg border-l-4 border-primary flex justify-between items-center">
            <span>{event.description}</span>
            <span className="text-xs text-text-secondary">{event.inning}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-text-secondary py-4">이벤트가 없습니다.</div>
      )}
    </div>
  );
};

export default EventFeed;
