import React, { useState, useEffect } from 'react';
import { Search, Loader2, FileText } from 'lucide-react';

const ReportsPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPlayers = async (searchQuery) => {
    setLoading(true);
    try {
      // 백엔드 검색 API 호출
      const res = await fetch(`/api/players/raw/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Error fetching raw players:', err);
    } finally {
      setLoading(false);
    }
  };

  // 처음 페이지 진입 시 전체 데이터(최대 100개) 불러오기
  useEffect(() => {
    searchPlayers('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchPlayers(query);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-text-primary">리포트 (Reports)</h1>
      <p className="text-text-secondary">MongoDB에 저장된 KBO 타자 원본 데이터베이스에서 선수의 연도별 성적을 검색합니다.</p>

      {/* 검색 바 UI */}
      <form onSubmit={handleSearch} className="relative flex items-center max-w-2xl gap-3 mt-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="선수명으로 검색해보세요 (예: 구자욱, 최정...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-secondary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <button type="submit" className="bg-primary hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center">
          검색
        </button>
      </form>

      {/* 검색 결과 데이터 테이블 */}
      <div className="bg-surface-secondary rounded-2xl border border-border-color shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-primary border-b border-border-color text-text-secondary sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">연도</th>
                <th className="px-6 py-4 font-semibold">선수명</th>
                <th className="px-6 py-4 font-semibold">타수</th>
                <th className="px-6 py-4 font-semibold">안타</th>
                <th className="px-6 py-4 font-semibold">홈런</th>
                <th className="px-6 py-4 font-semibold">타점</th>
                <th className="px-6 py-4 font-semibold">타율 (AVG)</th>
                <th className="px-6 py-4 font-semibold">OPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-text-secondary">
                    <Loader2 className="animate-spin inline-block mr-2" size={24} /> 데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-text-secondary">
                    <FileText className="inline-block mr-2 mb-1" size={24} /> 검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                results.map((row, index) => (
                  <tr key={row._id || index} className="hover:bg-surface-primary/50 transition-colors">
                    <td className="px-6 py-4 text-text-secondary">{row.연도}</td>
                    <td className="px-6 py-4 text-text-primary font-bold text-base">{row.선수명}</td>
                    <td className="px-6 py-4 text-text-secondary">{row.타수}</td>
                    <td className="px-6 py-4 text-text-secondary">{row.안타}</td>
                    <td className="px-6 py-4 text-danger font-bold">{row.홈런}</td>
                    <td className="px-6 py-4 text-info font-medium">{row.타점}</td>
                    <td className="px-6 py-4 text-text-secondary">{row.타율}</td>
                    <td className="px-6 py-4 text-primary font-bold">{row.OPS}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;