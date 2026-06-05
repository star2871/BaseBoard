import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FatigueChart = ({ data, onPointClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-surface-secondary rounded-lg border border-border-color">
        <p className="text-text-secondary">No fatigue history data available to display chart.</p>
      </div>
    );
  }

  const formattedData = data.map(item => ({
    originalDate: item.date,
    date: new Date(item.date).toLocaleDateString('en-CA'),
    score: parseFloat(item.score.toFixed(1)),
  }));

  return (
    <div className="h-80 bg-surface-secondary p-4 rounded-lg border border-border-color">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          onClick={(e) => {
            if (onPointClick && e && e.activePayload && e.activePayload.length > 0) {
              onPointClick(e.activePayload[0].payload);
            }
          }}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis domain={[0, 100]} stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Legend wrapperStyle={{ color: '#F9FAFB' }} />
          <Line type="monotone" dataKey="score" name="Fatigue Score" stroke="#3B82F6" activeDot={{ r: 8, style: { cursor: onPointClick ? 'pointer' : 'default' } }} dot={{ style: { cursor: onPointClick ? 'pointer' : 'default' } }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FatigueChart;