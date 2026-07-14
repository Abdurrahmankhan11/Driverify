import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Car, Heart, MessageCircle } from 'lucide-react';
import DashboardFeaturedVehicles from '../../components/landing/DashboardFeaturedVehicles';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg">
            Find your perfect ride today. You have 3 new messages regarding your inquiries.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DashboardFeaturedVehicles />
      </div>
    </div>
  );
};

export default UserDashboard;
