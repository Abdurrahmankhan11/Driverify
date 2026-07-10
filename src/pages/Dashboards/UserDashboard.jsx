import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Car, Heart, MessageCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#292524]">Welcome back, {user?.full_name || 'User'}!</h1>
        <p className="text-[#57534E]">Manage your vehicle listings and view your activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Active Listings</CardTitle>
            <Car className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">Vehicles you are selling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Saved Favorites</CardTitle>
            <Heart className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">Vehicles you liked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">From buyers or middlemen</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Add more dashboard content here later */}
    </div>
  );
};

export default UserDashboard;
