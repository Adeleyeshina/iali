import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar.jsx';
import AppFooter from './AppFooter.jsx';
import MobileBottomNav from './MobileBottomNav.jsx';

export default function WorkspaceLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
      <AppNavbar />
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 md:px-6 md:py-8">
        <Outlet />
        <AppFooter />
      </main>
      <MobileBottomNav />
    </div>
  );
}
