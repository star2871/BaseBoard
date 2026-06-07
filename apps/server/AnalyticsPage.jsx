import React, { useEffect, useState, useMemo } from 'react';
import usePlayerStore from '../store/playerStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Loader2, TrendingUp, Activity } from 'lucide-react';

const FATIGUE_COLORS = {
  Low: '#22c55e',      // Success (Green)
  Medium: '#3b82f6',   // Info (Blue)
  High: '#eab308',     // Warning (Yellow)
  Critical: '#ef4444'  // Danger (Red)
};

const AnalyticsPage = () => {
  const { players, fetchPlayers } = usePlayerStore();
  const [teamRankings, setTeamRankings] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    // 전체 선수 데이터 호출
    fetchPlayers();
    
    // 팀 순위/승률 데이터 호출
    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/teams/rankings');
        if (res.ok) {
          const data = await res.json();
          setTeamRankings(data);
        }
      } catch (error) {
        console.error('Failed to fetch team rankings', error);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, [fetchPlayers]);

  // 피로도 분포 데이터 가공 (파이 차트용)
  const fatigueDistribution = useMemo(() => {
    const dist = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    players.forEach(p => {
      if (dist[p.fatigueLevel] !== undefined) {
        dist[p.fatigueLevel]++;
      }
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [players]);

  // 팀별 승률 데이터 가공 (막대 차트용)
  const teamWinRates = useMemo(() => {
    return teamRankings.map(t => ({
      name: t.name,
      winRate: parseFloat((t.winPercentage * 100).toFixed(1))
    }));
  }, [teamRankings]);

  if (loadingTeams) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin mr-2 text-primary" /> 분석 데이터 불러오는 중...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-text-primary">분석 (Analytics)</h1>
      <p className="text-text-secondary">리그 전체의 팀별 성적 및 선수들의 피로도 분포 통계를 확인합니다.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* 팀별 승률 막대 차트 */}
        <div className="bg-surface-secondary p-6 rounded-2xl border border-border-color shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center"><TrendingUp className="mr-2 text-primary" /> 팀별 승률 (%)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamWinRates} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} cursor={{ fill: '#374151', opacity: 0.4 }} />
                <Bar dataKey="winRate" name="승률 (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 피로도 분포 파이 차트 */}
        <div className="bg-surface-secondary p-6 rounded-2xl border border-border-color shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center"><Activity className="mr-2 text-danger" /> 전체 선수 피로도 현황</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fatigueDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {fatigueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FATIGUE_COLORS[entry.name] || '#8884d8'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9CA3AF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;