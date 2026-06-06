import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Map, FileText, Settings, Trophy } from 'lucide-react';
import ProfileModal from './ProfileModal';

const navigation = [
  { name: '대시보드', href: '/', icon: LayoutDashboard },
  { name: '실시간 경기 센터', href: '/game-center', icon: Trophy },
  { name: '팀 및 선수', href: '/teams', icon: Users },
  { name: '분석', href: '/analytics', icon: BarChart3 },
  { name: '이동 및 일정', href: '/travel', icon: Map },
  { name: '리포트', href: '/reports', icon: FileText },
  { name: '설정', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
    <aside className="w-64 bg-surface-secondary p-4 flex flex-col border-r border-border-color">
      <div className="flex items-center mb-10 px-2">
        <div className="w-8 h-8 bg-primary rounded-md mr-3 flex-shrink-0"></div>
        <h1 className="text-xl font-bold text-text-primary">BASEBOARD</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 my-1 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-surface-tertiary hover:text-white'
                }`
              }
              >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
              </NavLink>
              </li>
              ))}
              </ul>
              </nav>
              <div className="mt-auto">
              <div className="flex items-center p-2 rounded-md hover:bg-surface-tertiary cursor-pointer" onClick={() => setProfileModalOpen(true)}>
              <img className="w-10 h-10 bg-surface-tertiary rounded-full mr-3 object-cover" src="https://i.pravatar.cc/150?u=coachkim" alt="Coach Kim" />
              <div>
              <p className="text-sm font-semibold text-text-primary">김 감독</p>
              <p className="text-xs text-text-secondary">헤드 코치</p>
              </div>
              </div>
              </div>
              </aside>
              <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
              </>
              );
              };

export default Sidebar;