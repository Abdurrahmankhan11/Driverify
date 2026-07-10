import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Car, Heart, MessageCircle } from 'lucide-react';
import FeaturedVehicles from '../../components/landing/FeaturedVehicles';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="text-2xl font-bold text-[#292524]">Welcome back, {user?.full_name || 'User'}!</h1>
        <p className="text-[#57534E]">Manage your vehicle listings and view your activity.</p>
      </div> */}

      
      
      <div className="mt-8">
        <FeaturedVehicles />
      </div>
    </div>
  );
};

export default UserDashboard;
