import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, userInfo } = useAuthStore();

  useEffect(() => {
    // 이미 로그인되어 있다면 메인 페이지로 이동
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      login(data); // Zustand 스토어에 사용자 정보 저장
      navigate('/'); // 메인 페이지로 이동

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          BASEBOARD 로그인
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 이메일 및 비밀번호 입력 필드 (SignUpPage와 유사) */}
          <div>
            <label htmlFor="email">이메일 주소</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? '로그인 중...' : '로그인'}</button>
          <div className="text-sm text-center">
            <Link to="/signup">계정이 없으신가요? 회원가입</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;