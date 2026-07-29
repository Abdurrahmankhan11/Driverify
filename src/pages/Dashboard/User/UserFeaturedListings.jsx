import React from 'react';
import LandingFeaturedVehicles from '../../../components/landing/LandingFeaturedVehicles';

const UserFeaturedListings = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 border-b border-border/60 pb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Featured Vehicles</h1>
          <p className="text-muted-foreground mt-1">Browse premium pre-owned cars and bikes directly from owners.</p>
        </div>
      </div>
      
      {/* Re-use the existing featured vehicles component but without its internal title */}
      <div className="mt-[-2rem]">
        <LandingFeaturedVehicles isDashboard={true} hideTitle={true} />
      </div>
    </div>
  );
};

export default UserFeaturedListings;
