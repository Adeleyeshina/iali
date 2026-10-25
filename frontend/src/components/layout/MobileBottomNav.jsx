import { NavLink } from 'react-router-dom';
import {
  Home as HomeIcon,
  Briefcase,
  PlusCircle,
  Search as SearchIcon,
  MessageSquare,
  FileText,
  User,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

// Mobile bottom navigation bar for authenticated users
export default function MobileBottomNav({ currentUser: propUser }) {
  const auth = useAuth();
  const currentUser = propUser !== undefined ? propUser : auth.user;
  if (!currentUser) return null;

  const getNavigationTabs = () => {
    if (currentUser?.role === 'recruiter') {
      return [
        { to: '/app', label: 'Hub', Icon: HomeIcon },
        { to: '/recruiter/jobs', label: 'My Jobs', Icon: Briefcase },
        { to: '/post-job', label: 'Post', Icon: PlusCircle },
        { to: '/search', label: 'Talent', Icon: SearchIcon },
        { to: '/inbox', label: 'Inbox', Icon: MessageSquare },
      ];
    }

    if (currentUser?.role === 'admin') {
      return [
        { to: '/app', label: 'Home', Icon: HomeIcon },
        { to: '/admin', label: 'Admin', Icon: Shield },
        { to: '/jobs', label: 'Jobs', Icon: Briefcase },
        { to: '/search', label: 'Talent', Icon: SearchIcon },
        { to: '/inbox', label: 'Inbox', Icon: MessageSquare },
      ];
    }

    return [
      { to: '/app', label: 'Home', Icon: HomeIcon },
      { to: '/jobs', label: 'Jobs', Icon: Briefcase },
      { to: '/applications', label: 'Track', Icon: FileText },
      { to: '/inbox', label: 'Inbox', Icon: MessageSquare },
      { to: '/profile', label: 'Profile', Icon: User },
    ];
  };

  const navigationTabs = getNavigationTabs();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around py-1.5 shadow-lg">
      {navigationTabs.map((tab) => {
        const TabIcon = tab.Icon;
        return (
          <NavLink
            key={tab.to + tab.label}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-xl transition ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            <TabIcon className="w-4 h-4" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
