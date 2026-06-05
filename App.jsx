import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import TeamDetailPage from './pages/TeamDetailPage';
import useSocketStore from './store/socketStore';

function App() {
  const connectSocket = useSocketStore((state) => state.connect);
  const disconnectSocket = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    connectSocket();
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
      </Route>
    </Routes>
  );
}

export default App;