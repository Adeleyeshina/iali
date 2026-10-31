import { Outlet } from 'react-router-dom';
import PublicNavbar from '../public/PublicNavbar.jsx';
import PublicFooter from '../public/PublicFooter.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <PublicNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
