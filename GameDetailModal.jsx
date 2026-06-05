import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameDetailModal = ({ isOpen, onClose, game }) => {
  if (!isOpen || !game) return null;

  const navigate = useNavigate();
  const won = game.homeScore > game.awayScore;

  const handlePlayerClick = (playerId) => {
    if (playerId) {
      navigate(`/players/${playerId}`);
      onClose(); // Close the modal after navigating
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-surface-secondary p-6 rounded-lg shadow-xl w-full max-w-lg border border-border-color">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-primary">Game Details</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={24} />
          </button>
        </div>
        <div>
          <p className="text-center text-text-secondary mb-4">{new Date(game.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="flex justify-around items-center text-center">
            <div className="flex-1"><p className="text-lg font-bold text-text-primary">{game.homeTeam.name}</p><p className={`text-5xl font-bold ${won ? 'text-success' : 'text-danger'}`}>{game.homeScore}</p></div>
            <div className="text-2xl font-light text-text-secondary px-4">VS</div>
            <div className="flex-1"><p className="text-lg font-bold text-text-primary">{game.awayTeam.name}</p><p className={`text-5xl font-bold ${!won ? 'text-success' : 'text-danger'}`}>{game.awayScore}</p></div>
          </div>
          <div className="mt-6 pt-4 border-t border-border-color">
            <div className="flex justify-around text-sm">
              <div className="w-1/2 pr-2">
                <h3 className="text-base font-semibold text-text-primary mb-2">{game.homeTeam.name} Lineup</h3>
                <ul className="text-text-secondary space-y-1">
                  {game.homeTeamLineup && game.homeTeamLineup.length > 0 ? game.homeTeamLineup.map((entry, index) => (
                    <li key={entry.player?._id || index} className="flex justify-between">
                      <span onClick={() => handlePlayerClick(entry.player?._id)} className="cursor-pointer hover:text-primary hover:underline">{entry.player?.name || 'N/A'}</span>
                      <span className="font-mono text-gray-500">{entry.position}</span>
                    </li>
                  )) : <li>No lineup data.</li>}
                </ul>
              </div>
              <div className="w-1/2 pl-2">
                <h3 className="text-base font-semibold text-text-primary mb-2">{game.awayTeam.name} Lineup</h3>
                <ul className="text-text-secondary space-y-1">
                  {game.awayTeamLineup && game.awayTeamLineup.length > 0 ? game.awayTeamLineup.map((entry, index) => (
                    <li key={entry.player?._id || index} className="flex justify-between">
                      <span onClick={() => handlePlayerClick(entry.player?._id)} className="cursor-pointer hover:text-primary hover:underline">{entry.player?.name || 'N/A'}</span>
                      <span className="font-mono text-gray-500">{entry.position}</span>
                    </li>
                  )) : <li>No lineup data.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailModal;