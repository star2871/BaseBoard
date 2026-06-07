import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
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
    connectSocket(window.location.origin); // 현재 도메인으로 Socket.io 연결
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <Routes>
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
    </Routes>
  );
}

export default App;