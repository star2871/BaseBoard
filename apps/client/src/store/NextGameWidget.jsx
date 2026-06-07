import { useEffect, useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';

const NextGameWidget = () => {
  const [nextGame, setNextGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const fetchNextGame = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/games/next'); // 상대 경로 사용
        if (!res.ok) {
          if (res.status === 404) setNextGame(null);
          else throw new Error('Failed to fetch next game data');
        } else {
          const data = await res.json();
          setNextGame(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNextGame();
  }, []);

  useEffect(() => {
    if (!nextGame) { setCountdown(null); return; }
    const gameDate = new Date(nextGame.date);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = gameDate.getTime() - now;
      if (distance < 0) {
        clearInterval(interval);
        setCountdown('started');
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown({ days: String(days).padStart(2, '0'), hours: String(hours).padStart(2, '0'), minutes: String(minutes).padStart(2, '0'), seconds: String(seconds).padStart(2, '0') });
    }, 1000);
    return () => clearInterval(interval);
  }, [nextGame]);

  const renderContent = () => {
    if (loading) return <div className="flex items-center justify-center h-full text-text-secondary"><Loader2 className="animate-spin mr-2" /> 데이터를 불러오는 중...</div>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!nextGame) return <p className="text-text-secondary">예정된 경기 일정이 없습니다.</p>;

    return (
      <div className="text-center">
        <p className="text-sm text-text-secondary">{new Date(nextGame.date).toLocaleDateString('ko-KR', { weekday: 'long', month: 'long', day: 'numeric' })} {new Date(nextGame.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
        <div className="mt-4 flex items-center justify-around space-x-4">
          <div className="flex flex-col items-center w-24"><span className="font-semibold text-text-primary truncate">{nextGame.homeTeam.name}</span></div>
          <span className="text-text-secondary text-xl">vs</span>
          <div className="flex flex-col items-center w-24"><span className="font-semibold text-text-primary truncate">{nextGame.awayTeam.name}</span></div>
        </div>
        {countdown === 'started' && <div className="mt-6"><p className="text-lg font-semibold text-success">경기 진행 중!</p></div>}
        {countdown && countdown !== 'started' && (
          <div className="mt-6">
            <p className="text-sm text-text-secondary mb-2">경기 시작까지</p>
            <div className="flex justify-center space-x-4 font-mono">
              <div><span className="text-3xl font-bold text-text-primary">{countdown.days}</span><span className="text-xs text-text-secondary block">일</span></div>
              <div><span className="text-3xl font-bold text-text-primary">{countdown.hours}</span><span className="text-xs text-text-secondary block">시간</span></div>
              <div><span className="text-3xl font-bold text-text-primary">{countdown.minutes}</span><span className="text-xs text-text-secondary block">분</span></div>
              <div><span className="text-3xl font-bold text-text-primary">{countdown.seconds}</span><span className="text-xs text-text-secondary block">초</span></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center">
        <Calendar className="mr-2 text-info" /> 다음 경기
      </h2>
      <div className="p-4 bg-surface-secondary rounded-lg border border-border-color min-h-[200px] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default NextGameWidget;