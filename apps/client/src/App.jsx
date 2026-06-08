import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 레이아웃 및 페이지 컴포넌트들을 임포트합니다.
// 파일 경로는 실제 프로젝트 구조에 맞게 조정해야 합니다.
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
// ... 다른 페이지들도 임포트

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인/회원가입과 같이 누구나 접근 가능한 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 로그인이 필요한 페이지들 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            {/* 여기에 다른 모든 보호된 페이지 라우트를 추가합니다. */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;