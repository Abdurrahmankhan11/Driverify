import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { constants } from '../../constants/constants';
import { SIDEBAR_CONFIG } from '../../constants/sidebarConfig';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Default to USER if no role is found (or undefined during load)
  const role = user?.role || constants.roles.USER;
  const navItems = SIDEBAR_CONFIG[role] || SIDEBAR_CONFIG.USER;

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 left-0 bg-background border-r border-border flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
       {!collapsed && (
  <span className="text-xl font-bold truncate">
    <span className="text-foreground">Second</span>
    <span className="text-primary">Ride</span>
  </span>
)}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("text-muted-foreground hover:text-primary hover:bg-muted", collapsed && "mx-auto")}
        >
          {collapsed ? <Icons.Menu className="h-5 w-5" /> : <Icons.ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden">
        {navItems.map((item, idx) => {
          const IconComponent = Icons[item.icon] || Icons.Circle;

          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
              title={collapsed ? item.label : undefined}
              end={item.path === `/dashboard/${role.toLowerCase()}`}
            >
              <IconComponent className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            <span className="text-sm font-bold text-muted-foreground">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {user?.full_name || 'User'}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || user?.phone || role}
              </span>
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className={cn(
            "w-full mt-4 border-border text-muted-foreground hover:text-primary hover:bg-muted",
            collapsed && "px-0"
          )}
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
        >
          <Icons.LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
