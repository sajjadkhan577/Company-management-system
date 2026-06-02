import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

export default function DashboardLayout() {
  const { sidebarOpen } = useSelector((s) => s.ui);

  return (
    <div className="min-h-screen bg-surface-bright text-on-surface">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-sidebar-width' : 'ml-0'}`}>
        <TopNavbar />
        <main className="p-8 min-h-[calc(100vh-64px)]">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
