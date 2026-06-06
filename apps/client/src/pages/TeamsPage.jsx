import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Search } from 'lucide-react';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin mr-2" /> Loading teams...</div>;

  // 검색어에 따른 필터링 로직
  const filteredTeams = teams.filter(team => {
    const term = searchTerm.toLowerCase();
    const matchTeamName = team.name.toLowerCase().includes(term);
    // 백엔드에서 선수 목록(players)을 함께 보내주는 경우 선수 이름으로도 검색
    const matchPlayerName = team.players?.some(player => player.name.toLowerCase().includes(term));
    
    return matchTeamName || matchPlayerName;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-text-primary">KBO 리그 팀 목록</h1>
      <p className="text-text-secondary">팀을 선택하면 소속 선수 명단과 최근 경기 기록을 확인할 수 있습니다.</p>
      
      {/* 검색창 UI */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-text-secondary" />
        </div>
        <input
          type="text"
          placeholder="팀 이름이나 선수 이름으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredTeams.map(team => (
          <div 
            key={team._id} 
            onClick={() => navigate(`/teams/${team._id}`)}
            className="bg-surface-secondary p-6 rounded-2xl border border-border-color shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-border-color group-hover:border-primary transition-colors overflow-hidden shrink-0 shadow-sm">
                {team.logoUrl ? (
                  <img 
                    src={team.logoUrl} 
                    alt={team.name} 
                    className="w-full h-full object-contain p-1" 
                    // 이미지를 불러오지 못하면 이미지를 숨겨서 UI 깨짐을 방지합니다
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-text-secondary text-xs">No Logo</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">{team.name}</h2>
              </div>
            </div>
            <div className="flex items-center text-text-secondary text-sm mt-4 pt-4 border-t border-surface-tertiary">
              <MapPin size={16} className="mr-1" />
              <span>{team.stadium || '구장 정보 없음'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 검색 결과가 없을 때 표시할 화면 */}
      {!loading && filteredTeams.length === 0 && (
        <div className="text-center py-12 text-text-secondary bg-surface-secondary rounded-xl border border-border-color shadow-sm">
          <p className="text-lg">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;