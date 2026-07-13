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
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Optional Top Header for Dashboard */}
        <header className="h-16 border-b border-border bg-background flex items-center px-6 lg:hidden">
            <span className="text-lg font-bold text-primary">SecondRide</span>
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
