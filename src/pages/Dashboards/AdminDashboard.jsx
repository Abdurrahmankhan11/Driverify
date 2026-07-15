import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ShieldAlert, Users, List, TrendingUp, UserCheck, UserX, Mail, Phone, Car, Tag, Layers, Box } from 'lucide-react';
import { adminService } from '../../services/api';
import { Button } from '../../components/ui/button';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState(null);
  const [vehicleStats, setVehicleStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [userStatsData, vehicleStatsData] = await Promise.all([
          adminService.getDashboardStats(days).catch(err => {
            console.error("Failed to fetch user stats", err);
            return null;
          }),
          adminService.getVehicleDashboardStats().catch(err => {
            console.error("Failed to fetch vehicle stats", err);
            return null;
          })
        ]);
        if (userStatsData) setStats(userStatsData);
        if (vehicleStatsData) setVehicleStats(vehicleStatsData);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [days]);

  if (loading && !stats) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard statistics...</div>;
  }

  const totals = stats?.totals || {};
  const signups = stats?.signups || {};
  const loginActivity = stats?.login_activity || {};
  
  const vSummary = vehicleStats?.summary || {};
  const vTypeSummary = vehicleStats?.vehicle_type_summary || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Hub</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user?.full_name || 'Admin'}. Here is your system overview.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <Button 
            variant={days === 7 ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setDays(7)}
            className="rounded-md"
          >
            Last 7 Days
          </Button>
          <Button 
            variant={days === 30 ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setDays(30)}
            className="rounded-md"
          >
            Last 30 Days
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totals.total_users || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active: {totals.active_users || 0} | Blocked: {totals.blocked_users || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phone Verified</CardTitle>
            <Phone className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totals.phone_verified || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Users with verified phones</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signups (Last {days}d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{signups[`last_${days}_days`] || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Today: {signups.today || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful Logins (Last {days}d)</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{loginActivity[`last_${days}_days_successful`] || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Failed: {loginActivity[`last_${days}_days_failed`] || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Signup Trend</CardTitle>
          </CardHeader>
          <CardContent>
             {signups.trend && signups.trend.length > 0 ? (
               <div className="flex h-32 items-end space-x-2">
                 {signups.trend.map((day, i) => {
                   const maxVal = Math.max(...signups.trend.map(t => t.count));
                   const height = maxVal > 0 ? (day.count / maxVal) * 100 : 0;
                   return (
                     <div key={i} className="flex flex-col items-center flex-1 group">
                       <div 
                         className="w-full bg-blue-500/80 rounded-t-md group-hover:bg-blue-600 transition-all relative"
                         style={{ height: `${Math.max(height, 5)}%` }}
                       >
                         <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-foreground text-background text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10">
                           {day.count}
                         </div>
                       </div>
                       <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">
                         {new Date(day.date).getDate()}/{new Date(day.date).getMonth()+1}
                       </span>
                     </div>
                   )
                 })}
               </div>
             ) : (
               <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">No signup data for this period.</div>
             )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {totals.role_breakdown && Object.entries(totals.role_breakdown).map(([role, count]) => {
                const total = totals.total_users || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={role} className="flex items-center">
                    <div className="w-24 text-sm font-medium">{role}</div>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden mx-4">
                      <div 
                        className={`h-full ${role === 'ADMIN' ? 'bg-red-500' : role === 'MIDDLEMAN' ? 'bg-orange-500' : 'bg-blue-500'}`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm text-muted-foreground">{count}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-foreground mt-10 mb-2 flex items-center gap-2">
        <Car className="h-6 w-6 text-indigo-500" /> Vehicle Operations Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
            <List className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{vSummary.total_vehicle_listings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Vehicles on platform</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Brands & Models</CardTitle>
            <Tag className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{vSummary.brands || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{vSummary.models || 0} Models across {vSummary.brands || 0} Brands</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vehicle Types</CardTitle>
            <Layers className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{vSummary.vehicle_types || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Categories available</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Variants</CardTitle>
            <Box className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{vSummary.variants || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Specific trims/variants</p>
          </CardContent>
        </Card>
      </div>

      {vTypeSummary.length > 0 && (
        <Card className="shadow-sm mt-6">
          <CardHeader>
            <CardTitle>Listings by Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vTypeSummary.map((item, idx) => {
                const total = vSummary.total_vehicle_listings || 1;
                const percentage = Math.round((item.count / total) * 100);
                return (
                  <div key={idx} className="flex items-center">
                    <div className="w-24 text-sm font-medium">{item.vehicle_type}</div>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden mx-4">
                      <div 
                        className="h-full bg-indigo-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm text-muted-foreground">{item.count}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default AdminDashboard;

