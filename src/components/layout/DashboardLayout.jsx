import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-white text-[#292524] font-sans">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Optional Top Header for Dashboard */}
        <header className="h-16 border-b border-[#E7E5E4] bg-white flex items-center px-6 lg:hidden">
            <span className="text-lg font-bold text-[#b70a10]">SecondRide</span>
        </header>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
