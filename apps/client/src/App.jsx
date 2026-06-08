import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// 레이아웃 및 페이지 컴포넌트들을 임포트합니다.
// 파일 경로는 실제 프로젝트 구조에 맞게 조정해야 합니다.
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import PlayerDetailPage from './pages/PlayerDetailPage';
import TeamDetailPage from './pages/TeamDetailPage';
import GameCenterPage from './pages/GameCenterPage';
import LiveGamePage from './pages/LiveGamePage';
import TeamsPage from './pages/TeamsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TravelSchedulePage from './pages/TravelSchedulePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import useSocketStore from './store/socketStore';

function App() {
  const connectSocket = useSocketStore((state) => state.connect);
  const disconnectSocket = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    // 앱이 로드될 때 소켓 연결을 시작합니다.
    connectSocket(window.location.origin);
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <Routes>
      {/* 로그인/회원가입과 같이 누구나 접근 가능한 페이지 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* 로그인이 필요한 페이지들 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="players/:id" element={<PlayerDetailPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="game-center" element={<GameCenterPage />} />
          <Route path="travel" element={<TravelSchedulePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="live-game" element={<LiveGamePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;