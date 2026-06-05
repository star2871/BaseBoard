import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../store/playerStore';
import { Loader2, Search } from 'lucide-react';

const PlayerStatusBoard = () => {
  const navigate = useNavigate();
  const { players, loading, error, fetchPlayers } = usePlayerStore();
  const [positionFilter, setPositionFilter] = useState('All');
  const [fatigueFilter, setFatigueFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const uniquePositions = useMemo(() => ['All', ...new Set(players.map(p => p.position).sort())], [players]);
  const fatigueLevels = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const positionMatch = positionFilter === 'All' || player.position === positionFilter;
      const fatigueMatch = fatigueFilter === 'All' || player.fatigueLevel === fatigueFilter;
      const searchMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      return positionMatch && fatigueMatch && searchMatch;
    });
  }, [players, positionFilter, fatigueFilter, searchTerm]);

  const getFatigueColor = (level) => {
    switch (level) {
      case 'Critical': return 'bg-danger';
      case 'High': return 'bg-warning';
      case 'Medium': return 'bg-info';
      case 'Low': return 'bg-success';
      default: return 'bg-gray-500';
    }
  };

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  if (loading && players.length === 0) {
    return <div className="flex items-center justify-center h-48 text-text-secondary"><Loader2 className="animate-spin mr-2" /> Loading Player Data...</div>;
  }

  if (error) {
    return <p className="text-danger text-center p-4">{error}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 border-b border-border-color">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="position-filter" className="text-xs font-medium text-text-secondary mr-2">Position</label>
            <select id="position-filter" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="bg-surface-primary border border-border-color rounded-md px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
              {uniquePositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fatigue-filter" className="text-xs font-medium text-text-secondary mr-2">Fatigue Level</label>
            <select id="fatigue-filter" value={fatigueFilter} onChange={(e) => setFatigueFilter(e.target.value)} className="bg-surface-primary border border-border-color rounded-md px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
              {fatigueLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
        </div>
        <div className="relative">
          <label htmlFor="search-filter" className="sr-only">Search by name</label>
          <input type="text" id="search-filter" placeholder="Search player..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-surface-primary border border-border-color rounded-md pl-8 pr-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">Player</th>
              <th scope="col" className="px-4 py-3">Position</th>
              <th scope="col" className="px-4 py-3">Fatigue Level</th>
              <th scope="col" className="px-4 py-3 w-1/4">Fatigue Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player._id} onClick={() => handlePlayerClick(player._id)} className="border-b border-border-color last:border-b-0 hover:bg-gray-700 cursor-pointer">
                <th scope="row" className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{player.name}</th>
                <td className="px-4 py-3">{player.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getFatigueColor(player.fatigueLevel)}`}></span>
                    {player.fatigueLevel}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div className={`${getFatigueColor(player.fatigueLevel)} h-2.5 rounded-full`} style={{ width: `${player.fatigueScore}%` }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPlayers.length === 0 && !loading && (
          <p className="text-center text-text-secondary py-8">No players match the current filters.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerStatusBoard;