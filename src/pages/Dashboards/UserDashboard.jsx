import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Car, Heart, MessageCircle } from 'lucide-react';
import FeaturedVehicles from '../../components/landing/FeaturedVehicles';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">

      <div className="mt-8">
        <FeaturedVehicles />
      </div>
    </div>
  );
};

export default UserDashboard;
