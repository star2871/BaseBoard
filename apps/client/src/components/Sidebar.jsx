import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Map, FileText, Settings, Trophy } from 'lucide-react';
import ProfileModal from './modals/ProfileModal';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Real-time Game Center', href: '/game-center', icon: Trophy },
  { name: 'Team & Players', href: '/teams', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Travel & Schedule', href: '/travel', icon: Map },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
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
                      : 'text-text-secondary hover:bg-gray-700 hover:text-white'
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
        <div className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer" onClick={() => setProfileModalOpen(true)}>
            <img className="w-10 h-10 bg-gray-500 rounded-full mr-3 object-cover" src="https://i.pravatar.cc/150?u=coachkim" alt="Coach Kim" />
            <div>
                <p className="text-sm font-semibold text-text-primary">Coach Kim</p>
                <p className="text-xs text-text-secondary">Head Coach</p>
            </div>
        </div>
      </div>
    </aside>
    <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
};

export default Sidebar;