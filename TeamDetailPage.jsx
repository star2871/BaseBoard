import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Users, BarChart2 } from 'lucide-react';

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError('');

        const [teamRes, gamesRes] = await Promise.all([
          fetch(`/api/teams/${id}`),
          fetch(`/api/teams/${id}/games`)
        ]);

        if (!teamRes.ok) throw new Error(`Team not found (status: ${teamRes.status})`);
        const teamData = await teamRes.json();
        setTeam(teamData);

        if (gamesRes.ok) {
          const gamesData = await gamesRes.json();
          setRecentGames(gamesData);
        } else {
          console.error('Could not fetch recent games');
          setRecentGames([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [id]);

  const handlePlayerClick = (playerId) => navigate(`/players/${playerId}`);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin mr-2" /> Loading team details...</div>;
  if (error) return <div className="text-danger p-4 bg-red-900/20 rounded-md">Error: {error}</div>;
  if (!team) return <div className="text-warning">Team data not available.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-4">{team.name}</h1>
      <div className="p-6 bg-surface-secondary rounded-lg border border-border-color mb-8">
        <p className="text-text-secondary"><strong>Stadium:</strong> <span className="text-text-primary">{team.stadium || 'N/A'}</span></p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center"><Users className="mr-2" /> Player Roster</h2>
        <div className="bg-surface-secondary rounded-lg border border-border-color">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase"><tr><th scope="col" className="px-4 py-3">Name</th><th scope="col" className="px-4 py-3">Position</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3">Fatigue</th></tr></thead>
            <tbody>
              {team.players && team.players.map(player => (<tr key={player._id} onClick={() => handlePlayerClick(player._id)} className="border-b border-border-color last:border-b-0 hover:bg-gray-700 cursor-pointer"><th scope="row" className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{player.name}</th><td className="px-4 py-3">{player.position}</td><td className="px-4 py-3">{player.status}</td><td className="px-4 py-3">{player.fatigueLevel}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center"><BarChart2 className="mr-2" /> Recent Games</h2>
        {recentGames.length > 0 ? (
          <div className="space-y-3">
            {recentGames.map(game => {
              const isHome = game.homeTeam._id.toString() === id;
              const teamScore = isHome ? game.homeScore : game.awayScore;
              const opponentScore = isHome ? game.awayScore : game.homeScore;
              const won = teamScore > opponentScore;
              return (<div key={game._id} className="bg-surface-secondary p-4 rounded-lg border border-border-color flex justify-between items-center"><p className="text-sm text-text-secondary">{new Date(game.date).toLocaleDateString()}</p><p className="font-semibold text-text-primary">vs {isHome ? game.awayTeam.name : game.homeTeam.name}</p><div className="text-right"><p className={`text-lg font-bold ${won ? 'text-success' : 'text-danger'}`}>{teamScore} - {opponentScore}</p><p className={`text-sm font-semibold ${won ? 'text-success' : 'text-danger'}`}>{won ? 'WIN' : 'LOSS'}</p></div></div>);
            })}
          </div>
        ) : (<p className="text-text-secondary p-4 bg-surface-secondary rounded-lg border border-border-color">No recent game data available.</p>)}
      </div>
    </div>
  );
};

export default TeamDetailPage;