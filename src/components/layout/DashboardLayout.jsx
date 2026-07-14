import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import ShowNotification from '../common/ShowNotification';
import { Home, ChevronRight } from 'lucide-react';
import { SIDEBAR_CONFIG } from '../../constants/sidebarConfig';
import { useAuth } from '../../context/AuthContext';

// Extra route labels for sub-routes not in sidebar
const EXTRA_ROUTE_LABELS = {
  '/dashboard/user/profile/edit': 'Update Profile',
};

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Find current page title based on path
  const role = user?.role || 'USER';
  const navItems = SIDEBAR_CONFIG[role] || SIDEBAR_CONFIG.USER;

  // Check extra routes first (more specific paths), then sidebar items
  let pageTitle = EXTRA_ROUTE_LABELS[location.pathname];
  if (!pageTitle) {
    const currentNav = [...navItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + '/')
      );
    pageTitle = currentNav ? currentNav.label : 'Dashboard';
  }

  // Determine the dashboard home path based on role
  const dashboardHome = `/dashboard/${role.toLowerCase()}`;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-20">
          {/* Left: Breadcrumb / Page Title */}
          <div className="flex items-center gap-2 text-sm">
            <Link
              to={dashboardHome}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>

            <ChevronRight size={14} className="text-muted-foreground/50" />

            <span className="font-semibold text-foreground">
              {pageTitle}
            </span>
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
