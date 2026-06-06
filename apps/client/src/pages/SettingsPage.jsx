import React, { useState } from 'react';
import { Bell, Moon, Database, Shield, Save, User } from 'lucide-react';

const SettingsPage = () => {
  // 로컬 스토리지에서 기존 설정값을 불러오거나 기본값 세팅
  const [pushEnabled, setPushEnabled] = useState(() => JSON.parse(localStorage.getItem('setting_push') ?? 'true'));
  const [emailEnabled, setEmailEnabled] = useState(() => JSON.parse(localStorage.getItem('setting_email') ?? 'false'));
  const [autoSync, setAutoSync] = useState(() => JSON.parse(localStorage.getItem('setting_sync') ?? 'true'));
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('setting_dark') ?? 'true'));

  // 토글 스위치 UI 컴포넌트
  const Toggle = ({ enabled, onChange }) => (
    <div 
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-gray-600'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : ''}`}></div>
    </div>
  );

  // 변경 사항 저장 버튼 클릭 시 실행될 함수
  const handleSaveSettings = () => {
    localStorage.setItem('setting_push', JSON.stringify(pushEnabled));
    localStorage.setItem('setting_email', JSON.stringify(emailEnabled));
    localStorage.setItem('setting_sync', JSON.stringify(autoSync));
    localStorage.setItem('setting_dark', JSON.stringify(darkMode));
    
    // 다크모드 실제 반영을 위한 html 태그 클래스 조작
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    alert('✅ 설정이 브라우저에 성공적으로 저장되었습니다!\n(이메일 발송 등 일부 기능은 백엔드 서버 연동이 추가로 필요합니다.)');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">설정 (Settings)</h1>
        <p className="text-text-secondary mt-2">대시보드 환경 설정 및 알림, 데이터 동기화 옵션을 관리합니다.</p>
      </div>

      <div className="space-y-6 mt-6">
        {/* 내 계정 섹션 */}
        <section className="bg-surface-secondary rounded-2xl border border-border-color shadow-sm p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center"><User className="mr-2 text-primary" size={20} /> 내 계정</h2>
          <div className="flex items-center justify-between border-b border-border-color pb-4">
            <div>
              <p className="font-medium text-text-primary">프로필 정보</p>
              <p className="text-sm text-text-secondary">이름, 이메일 등 기본 정보를 수정합니다.</p>
            </div>
            <button className="px-4 py-2 bg-surface-primary border border-border-color rounded-lg text-sm font-medium hover:text-primary transition-colors">수정하기</button>
          </div>
        </section>

        {/* 알림 설정 섹션 */}
        <section className="bg-surface-secondary rounded-2xl border border-border-color shadow-sm p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center"><Bell className="mr-2 text-warning" size={20} /> 알림 설정</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-color pb-4">
              <div>
                <p className="font-medium text-text-primary">피로도 위험 푸시 알림</p>
                <p className="text-sm text-text-secondary">선수의 피로도가 Critical에 도달하면 실시간 알림을 받습니다.</p>
              </div>
              <Toggle enabled={pushEnabled} onChange={setPushEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">일일 리포트 이메일 수신</p>
                <p className="text-sm text-text-secondary">매일 아침 팀의 전날 경기 요약 리포트를 이메일로 받습니다.</p>
              </div>
              <Toggle enabled={emailEnabled} onChange={setEmailEnabled} />
            </div>
          </div>
        </section>

        {/* 앱 환경 및 데이터 섹션 */}
        <section className="bg-surface-secondary rounded-2xl border border-border-color shadow-sm p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center"><Database className="mr-2 text-info" size={20} /> 환경 및 데이터</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-color pb-4">
              <div>
                <p className="font-medium text-text-primary">다크 모드 적용</p>
                <p className="text-sm text-text-secondary">눈을 편안하게 해주는 어두운 테마를 사용합니다.</p>
              </div>
              <Toggle enabled={darkMode} onChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">실시간 데이터 자동 동기화</p>
                <p className="text-sm text-text-secondary">소켓(Socket) 통신을 통해 새로고침 없이 데이터를 갱신합니다.</p>
              </div>
              <Toggle enabled={autoSync} onChange={setAutoSync} />
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSaveSettings} 
          className="bg-primary hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center"
        >
          <Save className="mr-2" size={20} /> 변경 사항 저장
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;