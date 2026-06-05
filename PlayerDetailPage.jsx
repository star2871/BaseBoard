import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import FatigueChart from '../components/charts/FatigueChart';
import GameDetailModal from '../components/modals/GameDetailModal';

const PlayerDetailPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isGameModalOpen, setGameModalOpen] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError('');

        const [playerRes, gamesRes] = await Promise.all([
          fetch(`/api/players/${id}`),
          fetch(`/api/players/${id}/games`),
        ]);

        if (!playerRes.ok) throw new Error(`Player not found (status: ${playerRes.status})`);
        const playerData = await playerRes.json();
        setPlayer(playerData);

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

    fetchPageData();
  }, [id]);

  const handleChartClick = (payload) => {
    if (!payload || !payload.originalDate) return;
    const clickedDate = new Date(payload.originalDate);
    const targetDateStart = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    const targetDateEnd = new Date(targetDateStart.getTime() + 24 * 60 * 60 * 1000);

    const gameOnDate = recentGames.find((game) => {
      const gameDate = new Date(game.date);
      return gameDate >= targetDateStart && gameDate < targetDateEnd;
    });

    if (gameOnDate) {
      setSelectedGame(gameOnDate);
      setGameModalOpen(true);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin mr-2" /> Loading player details...</div>;
  if (error) return <div className="text-danger p-4 bg-red-900/20 rounded-md">Error: {error}</div>;
  if (!player) return <div className="text-warning">Player data not available.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-4">{player.name} - {player.position}</h1>
      <div className="p-6 bg-surface-secondary rounded-lg border border-border-color grid grid-cols-1 md:grid-cols-2 gap-4">
        <p className="text-text-secondary"><strong>Team:</strong> <span className="text-text-primary">{player.team?.name || 'N/A'}</span></p>
        <p className="text-text-secondary"><strong>Status:</strong> <span className="text-text-primary">{player.status}</span></p>
        <p className="text-text-secondary"><strong>Fatigue Score:</strong> <span className="text-text-primary">{player.fatigueScore.toFixed(1)}</span></p>
        <p className="text-text-secondary"><strong>Fatigue Level:</strong> <span className="text-text-primary">{player.fatigueLevel}</span></p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Fatigue History</h2>
        <FatigueChart data={player.fatigueHistory} onPointClick={handleChartClick} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Recent Games</h2>
        {recentGames.length > 0 ? (
          <div className="space-y-3">
            {recentGames.map(game => {
              if (!player.team) return null;
              const isHome = game.homeTeam._id.toString() === player.team._id.toString();
              const playerScore = isHome ? game.homeScore : game.awayScore;
              const opponentScore = isHome ? game.awayScore : game.homeScore;
              const won = playerScore > opponentScore;
              return (
                <div key={game._id} className="bg-surface-secondary p-4 rounded-lg border border-border-color flex justify-between items-center">
                  <div>
                    <p className="text-sm text-text-secondary">{new Date(game.date).toLocaleDateString()}</p>
                    <p className="font-semibold text-text-primary">{game.homeTeam.name} vs {game.awayTeam.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${won ? 'text-success' : 'text-danger'}`}>{playerScore} - {opponentScore}</p>
                    <p className={`text-sm font-semibold ${won ? 'text-success' : 'text-danger'}`}>{won ? 'WIN' : 'LOSS'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : ( <p className="text-text-secondary p-4 bg-surface-secondary rounded-lg border border-border-color">No recent game data available.</p> )}
      </div>

      <GameDetailModal isOpen={isGameModalOpen} onClose={() => setGameModalOpen(false)} game={selectedGame} />
    </div>
  );
};

export default PlayerDetailPage;