import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Calendar, Navigation, Bus, Clock, MapPin, Loader2 } from 'lucide-react';

// 위도/경도를 바탕으로 실제 거리를 계산하는 하버사인(Haversine) 공식
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // 지구의 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

const TravelSchedulePage = () => {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch('/api/games/upcoming');
        if (res.ok) {
          const data = await res.json();
          setUpcomingGames(data);
        }
      } catch (error) {
        console.error('Error fetching upcoming games:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-text-secondary"><Loader2 className="animate-spin mr-2 text-primary" /> 일정 데이터를 불러오는 중...</div>;
  if (upcomingGames.length === 0) return <div className="flex items-center justify-center h-full text-text-secondary">예정된 일정이 없습니다.</div>;

  const nextGame = upcomingGames[0];
  let distance = 0;
  let fatigueImpact = 0;

  if (nextGame && nextGame.awayTeam.location && nextGame.homeTeam.location) {
    distance = calculateDistance(
      nextGame.awayTeam.location.lat, nextGame.awayTeam.location.lng,
      nextGame.homeTeam.location.lat, nextGame.homeTeam.location.lng
    );
    fatigueImpact = Math.round(distance / 20); // 거리에 비례하여 피로도 증가 (가상 로직)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-text-primary">이동 및 일정 (Travel & Schedule)</h1>
      <p className="text-text-secondary">향후 경기 일정과 구장 좌표 기반 원정 이동 거리를 확인하여 선수단 컨디션을 관리하세요.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* 맵 & 이동 요약 (좌측 2칸 넓이) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-secondary p-6 rounded-2xl border border-border-color shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
              <MapIcon className="mr-2 text-primary" /> 다음 원정 이동 경로
            </h2>
            {/* 맵 그래픽 플레이스홀더 */}
            <div className="aspect-video bg-surface-primary rounded-xl border border-surface-tertiary flex items-center justify-center relative overflow-hidden">
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#4f46e5 2px, transparent 2px)", backgroundSize: "30px 30px" }}></div>
              
              {/* 이동 경로 도식화 */}
              <div className="relative w-full max-w-lg px-8 flex items-center justify-between z-10">
                {/* 경로 점선 */}
                <div className="absolute left-16 right-16 top-1/2 transform -translate-y-1/2 border-t-4 border-dashed border-surface-tertiary z-0"></div>
                
                {/* 출발지 */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-xs font-bold text-text-secondary mb-2 bg-surface-secondary px-3 py-1 rounded-full border border-border-color">출발 (Away)</span>
                  <div className="bg-surface-secondary w-28 h-28 rounded-2xl shadow-xl border-2 border-border-color flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                    {nextGame.awayTeam.logoUrl ? (
                      <img src={nextGame.awayTeam.logoUrl} alt={nextGame.awayTeam.name} className="w-12 h-12 object-contain mb-1" onError={(e) => e.target.style.display='none'}/>
                    ) : (
                      <MapPin className="text-text-secondary mb-1" size={24} />
                    )}
                    <span className="text-sm px-2 font-black text-text-primary text-center leading-tight mt-1">{nextGame.awayTeam.name}</span>
                  </div>
                </div>

                {/* 이동 수단 (버스) 및 정보 */}
                <div className="relative z-10 flex flex-col items-center -mt-12">
                  <div className="bg-primary p-4 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] text-white mb-3 animate-bounce">
                    <Bus size={32} />
                  </div>
                  {distance > 0 ? (
                    <>
                      <span className="bg-surface-secondary px-5 py-2 rounded-full text-sm font-black text-primary border border-primary/30 shadow-md">약 {distance}km</span>
                      <span className="mt-2 text-xs font-bold text-danger bg-danger/10 px-3 py-1 rounded-md border border-danger/20">예상 피로도 +{fatigueImpact}</span>
                    </>
                  ) : (
                    <span className="bg-surface-secondary px-5 py-2 rounded-full text-sm font-black text-text-secondary border border-border-color shadow-md">이동 없음</span>
                  )}
                </div>

                {/* 도착지 */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-xs font-bold text-primary mb-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">도착 (Home)</span>
                  <div className="bg-surface-secondary w-28 h-28 rounded-2xl shadow-xl border-2 border-primary/50 flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                    {nextGame.homeTeam.logoUrl ? (
                      <img src={nextGame.homeTeam.logoUrl} alt={nextGame.homeTeam.name} className="w-12 h-12 object-contain mb-1" onError={(e) => e.target.style.display='none'}/>
                    ) : (
                      <MapPin className="text-primary mb-1" size={24} />
                    )}
                    <span className="text-sm px-2 font-black text-text-primary text-center leading-tight mt-1">{nextGame.homeTeam.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 다가오는 일정 (우측 1칸 넓이) */}
        <div className="space-y-6">
          <div className="bg-surface-secondary p-6 rounded-2xl border border-border-color shadow-sm h-full">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
              <Calendar className="mr-2 text-info" /> 다가오는 일정
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {upcomingGames.map((game, index) => {
                let gameDist = 0;
                let gameEst = '이동 없음';
                if (game.awayTeam.location && game.homeTeam.location) {
                  gameDist = calculateDistance(
                    game.awayTeam.location.lat, game.awayTeam.location.lng,
                    game.homeTeam.location.lat, game.homeTeam.location.lng
                  );
                  if (gameDist > 0) {
                    const h = Math.floor(gameDist / 80); // 버스 평균 80km/h
                    const m = Math.round(((gameDist / 80) - h) * 60);
                    gameEst = `버스 약 ${h > 0 ? h + '시간 ' : ''}${m > 0 ? m + '분' : ''}`;
                  }
                }

                return (
                <div key={game._id} className={`p-5 bg-surface-primary rounded-xl border transition-colors group ${index === 0 ? 'border-primary shadow-md bg-primary/5' : 'border-surface-tertiary hover:border-primary/50'}`}>
                  <div className="text-sm text-text-secondary mb-3 flex items-center justify-between">
                    <span>{new Date(game.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
                    <span className={`${index === 0 ? 'text-primary bg-primary/10' : 'text-text-secondary bg-surface-secondary'} font-bold px-2 py-1 rounded`}>
                      {new Date(game.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="font-black text-text-primary flex justify-between items-center text-lg mb-4">
                    <span className="truncate">{game.awayTeam.name}</span>
                    <span className="text-surface-tertiary text-sm mx-2 font-normal shrink-0">@</span>
                    <span className="truncate text-right">{game.homeTeam.name}</span>
                  </div>
                  <div className="flex flex-col space-y-2 text-xs text-text-secondary bg-surface-secondary p-3 rounded-lg">
                    <div className="flex items-center truncate"><MapIcon size={14} className="mr-2 text-text-primary shrink-0" /> {game.homeTeam.stadium || '구장 정보 없음'}</div>
                    <div className="flex items-center truncate"><Clock size={14} className="mr-2 text-text-primary shrink-0" /> 이동: {gameDist > 0 ? `약 ${gameDist}km` : '없음'} {gameDist > 0 && `(${gameEst})`}</div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelSchedulePage;