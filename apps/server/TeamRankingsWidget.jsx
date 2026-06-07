import { useEffect, useState } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamRankingsWidget = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/teams/rankings');
        if (!res.ok) {
          throw new Error('Failed to fetch team rankings');
        }
        const data = await res.json();
        setRankings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full text-text-secondary"><Loader2 className="animate-spin mr-2" /> 팀 순위 불러오는 중...</div>;
    }
    if (error) {
      return <p className="text-danger">{error}</p>;
    }
    if (rankings.length === 0) {
      return <p className="text-text-secondary">순위 데이터가 없습니다.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary uppercase">
            <tr>
              <th scope="col" className="px-2 py-2">순위</th>
              <th scope="col" className="px-2 py-2">팀명</th>
              <th scope="col" className="px-2 py-2 text-center">승</th>
              <th scope="col" className="px-2 py-2 text-center">패</th>
              <th scope="col" className="px-2 py-2 text-right">승률</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((team, index) => (
              <tr key={team._id} className="border-b border-border-color last:border-b-0 hover:bg-gray-700 cursor-pointer" onClick={() => handleTeamClick(team._id)}>
                <td className="px-2 py-3">{index + 1}</td>
                <th scope="row" className="px-2 py-3 font-medium text-text-primary whitespace-nowrap">{team.name}</th>
                <td className="px-2 py-3 text-center">{team.wins}</td>
                <td className="px-2 py-3 text-center">{team.losses}</td>
                <td className="px-2 py-3 text-right font-mono">{team.winPercentage.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center">
        <Trophy className="mr-2 text-warning" /> 팀 순위
      </h2>
      <div className="p-4 bg-surface-secondary rounded-lg border border-border-color min-h-[200px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default TeamRankingsWidget;