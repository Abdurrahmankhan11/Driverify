import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Briefcase, ClipboardCheck, Users } from 'lucide-react';

const MiddlemanDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#292524]">Middleman Portal</h1>
        <p className="text-[#57534E]">Welcome, {user?.full_name || 'Middleman'}. Manage your deals and inspections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Active Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">In negotiation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Pending Inspections</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">Vehicles to inspect</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#57534E]">Assigned Buyers</CardTitle>
            <Users className="h-4 w-4 text-[#78716C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#292524]">0</div>
            <p className="text-xs text-[#78716C]">Clients you are assisting</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MiddlemanDashboard;
