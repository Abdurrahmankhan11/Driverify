import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardFeaturedVehicles from '../../../components/landing/DashboardFeaturedVehicles';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* <div className="mb-2">
        <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-1 block">
          Welcome to SecondRide
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'User'}!
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Discover premium pre-owned vehicles or list your own ride to reach thousands of potential buyers today.
        </p>
      </div> */}

      <div className="pt-2">
        <DashboardFeaturedVehicles />
      </div>
    </div>
  );
};

export default UserDashboard;
