import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ShieldAlert, Users, List, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#292524]">Admin Hub</h1>
        <p className="text-[#57534E]">Welcome, {user?.full_name || 'Admin'}. System overview and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">Registered on platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">All Listings</CardTitle>
            <List className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">Active vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Platform Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">₹ 0</div>
            <p className="text-xs text-[#78716C]">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">System Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">Requires attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
