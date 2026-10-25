import { useLocation } from 'react-router-dom';
import PublicNavbar from '../public/PublicNavbar.jsx';
import PublicFooter from '../public/PublicFooter.jsx';
import AppNavbar from './AppNavbar.jsx';
import AppFooter from './AppFooter.jsx';
import MobileBottomNav from './MobileBottomNav.jsx';

// Main layout wrapper handling public marketing vs authenticated workspace headers and footers
export default function MainLayout({ children }) {
  const location = useLocation();
  const isPublicPage =
    location.pathname === '/' ||
    location.pathname === '/about' ||
    location.pathname === '/solutions' ||
    location.pathname === '/login' ||
    location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
      {isPublicPage ? <PublicNavbar /> : <AppNavbar />}

      {isPublicPage ? (
        <main className="flex-1 w-full">{children}</main>
      ) : (
        <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 py-6 md:px-6 md:py-8">
          {children}
          <AppFooter />
        </main>
      )}

      {isPublicPage && <PublicFooter />}

      {!isPublicPage && <MobileBottomNav />}
    </div>
  );
}
