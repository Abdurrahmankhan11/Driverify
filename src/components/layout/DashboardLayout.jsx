import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import ShowNotification from '../common/ShowNotification';
import { Bell, Menu, Search, LayoutDashboard } from 'lucide-react';
import { SIDEBAR_CONFIG } from '../../constants/sidebarConfig';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Find current page title based on path
  const role = user?.role || 'USER';
  const navItems = SIDEBAR_CONFIG[role] || SIDEBAR_CONFIG.USER;
  const currentNav = navItems.find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
  const pageTitle = currentNav ? currentNav.label : 'Dashboard';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#292524] font-sans">
      <AppSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E7E5E4] flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 text-[#57534E] hover:text-[#b70a10] hover:bg-[#F5F5F4] rounded-lg transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[#57534E]">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm font-medium text-[#78716C]">Home /</span>
              <h1 className="text-base font-semibold text-[#18181B]">
                {pageTitle}
              </h1>
            </div>
            {/* Mobile Title */}
            <h1 className="text-base font-semibold text-[#18181B] sm:hidden">
              {pageTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <div className="relative hidden md:block text-[#78716C]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E7E5E4] focus:bg-white focus:border-[#b70a10] focus:ring-1 focus:ring-[#b70a10] rounded-lg text-sm w-56 lg:w-72 transition-all outline-none"
              />
            </div> */}
            
            <button
              onClick={() => setNotificationOpen(true)}
              className="relative p-2.5 text-[#57534E] hover:text-[#b70a10] hover:bg-[#F5F5F4] rounded-full transition-colors focus:outline-none"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#16a34a] text-[10px] font-bold text-white ring-2 ring-white">
                7
              </span>
            </button>
          </div>
        </header>
        <ShowNotification open={notificationOpen} onClose={() => setNotificationOpen(false)} />
        
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[#F8FAFC]">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
