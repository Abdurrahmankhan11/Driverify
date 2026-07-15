import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, List, TrendingUp, UserCheck, Phone, Car, Tag, Layers, Box, Info } from 'lucide-react';
import { adminService } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../components/ui/tooltip';
import Chart from 'react-apexcharts';
import { useTheme } from 'next-themes';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, tooltipText }) => (
  <Card className={`border-l-4 ${colorClass} shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        {title}
        {tooltipText && (
          <TooltipProvider>
            <Tooltip delay={300}>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardTitle>
      <div className={`p-2 rounded-lg bg-background/50 backdrop-blur-sm group-hover:scale-110 transition-transform ${colorClass.replace('border-l-', 'text-')}`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{subtext}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const { theme, systemTheme } = useTheme();
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState(null);
  const [vehicleStats, setVehicleStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

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

  const baseChartOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
      }
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    dataLabels: { enabled: false },
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] w-full rounded-xl" />
          <Skeleton className="h-[350px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-8 w-64 mt-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-[350px] w-full rounded-xl" />
      </div>
    );
  }

  const totals = stats?.totals || {};
  const signups = stats?.signups || {};
  const loginActivity = stats?.login_activity || {};
  
  const vSummary = vehicleStats?.summary || {};
  const vTypeSummary = vehicleStats?.vehicle_type_summary || [];

  // Signup Trend Chart
  const signupSeries = [{
    name: 'New Signups',
    data: (signups.trend || []).map(t => t.count)
  }];
  const signupOptions = {
    ...baseChartOptions,
    colors: ['#8b5cf6'], // purple-500
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: (signups.trend || []).map(t => {
        const d = new Date(t.date);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      }),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      decimalsInFloat: 0,
      forceNiceScale: true,
      labels: {
        formatter: (val) => parseInt(val)
      }
    },
    grid: {
      borderColor: isDark ? '#334155' : '#e2e8f0',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    }
  };

  // Role Distribution Chart
  const roleSeries = totals.role_breakdown ? Object.values(totals.role_breakdown) : [];
  const roleLabels = totals.role_breakdown ? Object.keys(totals.role_breakdown) : [];
  const roleOptions = {
    ...baseChartOptions,
    labels: roleLabels,
    colors: ['#ef4444', '#f97316', '#3b82f6'], // red, orange, blue
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true },
            value: { show: true, formatter: val => val },
            total: {
              show: true,
              label: 'Total Users',
              color: isDark ? '#f8fafc' : '#0f172a',
              formatter: () => totals.total_users || 0
            }
          }
        }
      }
    },
    stroke: { show: true, colors: isDark ? '#0f172a' : '#ffffff', width: 2 },
    legend: { position: 'bottom' }
  };

  // Vehicle Types Chart
  const vehicleTypeSeries = [{
    name: 'Listings',
    data: vTypeSummary.map(t => t.count)
  }];
  
  // Operations Overview Chart (Polar Area)
  const opsSeries = [
    vSummary.total_vehicle_listings || 0,
    vSummary.brands || 0,
    vSummary.models || 0,
    vSummary.vehicle_types || 0,
    vSummary.variants || 0
  ];
  const opsLabels = ['Total Listings', 'Brands', 'Models', 'Vehicle Types', 'Variants'];
  const opsOptions = {
    ...baseChartOptions,
    labels: opsLabels,
    colors: ['#6366f1', '#06b6d4', '#3b82f6', '#ec4899', '#eab308'],
    stroke: { colors: isDark ? ['#0f172a'] : ['#ffffff'] },
    fill: { opacity: 0.8 },
    yaxis: { show: false },
    legend: { position: 'bottom' }
  };
  const vehicleTypeOptions = {
    ...baseChartOptions,
    colors: ['#6366f1'], // indigo-500
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4,
        dataLabels: { position: 'top' }
      }
    },
    xaxis: {
      categories: vTypeSummary.map(t => t.vehicle_type),
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: {
      borderColor: isDark ? '#334155' : '#e2e8f0',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    dataLabels: {
      enabled: true,
      formatter: val => val,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: [isDark ? '#e2e8f0' : '#475569']
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Hub</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user?.full_name || 'Admin'}. Here is your system overview.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg border border-border/50 shadow-sm">
          <Button 
            variant={days === 7 ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setDays(7)}
            className={`rounded-md px-4 ${days === 7 ? 'shadow-sm' : 'hover:bg-background/50'}`}
          >
            Last 7 Days
          </Button>
          <Button 
            variant={days === 30 ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setDays(30)}
            className={`rounded-md px-4 ${days === 30 ? 'shadow-sm' : 'hover:bg-background/50'}`}
          >
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Users" 
          value={totals.total_users || 0} 
          subtext={`Active: ${totals.active_users || 0} | Blocked: ${totals.blocked_users || 0}`}
          icon={Users}
          colorClass="border-l-blue-500"
        />
        <StatCard 
          title="Phone Verified" 
          value={totals.phone_verified || 0} 
          subtext="Users with verified phones"
          icon={Phone}
          colorClass="border-l-green-500"
          tooltipText="Number of users who have successfully verified their phone number via OTP."
        />
        <StatCard 
          title={`Signups (Last ${days}d)`} 
          value={signups[`last_${days}_days`] || 0} 
          subtext={`Today: ${signups.today || 0}`}
          icon={TrendingUp}
          colorClass="border-l-purple-500"
        />
        <StatCard 
          title={`Successful Logins (Last ${days}d)`} 
          value={loginActivity[`last_${days}_days_successful`] || 0} 
          subtext={`Failed: ${loginActivity[`last_${days}_days_failed`] || 0}`}
          icon={UserCheck}
          colorClass="border-l-orange-500"
          tooltipText="Tracks successful vs failed login attempts over the selected period."
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Signup Trend</CardTitle>
          </CardHeader>
          <CardContent>
             {signups.trend && signups.trend.length > 0 ? (
               <div className="h-[300px] w-full">
                 <Chart options={signupOptions} series={signupSeries} type="area" height="100%" width="100%" />
               </div>
             ) : (
               <div className="h-[300px] flex items-center justify-center text-muted-foreground">No signup data for this period.</div>
             )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {roleSeries.length > 0 ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Chart options={roleOptions} series={roleSeries} type="donut" height="100%" width="100%" />
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No role data available.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Insights Section */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
            <Car className="h-6 w-6" />
          </div>
          Vehicle Operations Insights
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <StatCard 
              title="Total Listings" 
              value={vSummary.total_vehicle_listings || 0} 
              subtext="Vehicles on platform"
              icon={List}
              colorClass="border-l-indigo-500"
            />
            <StatCard 
              title="Brands & Models" 
              value={vSummary.brands || 0} 
              subtext={`${vSummary.models || 0} Models across ${vSummary.brands || 0} Brands`}
              icon={Tag}
              colorClass="border-l-cyan-500"
            />
            <StatCard 
              title="Vehicle Types" 
              value={vSummary.vehicle_types || 0} 
              subtext="Categories available"
              icon={Layers}
              colorClass="border-l-pink-500"
            />
            <StatCard 
              title="Variants" 
              value={vSummary.variants || 0} 
              subtext="Specific trims/variants"
              icon={Box}
              colorClass="border-l-yellow-500"
            />
          </div>
          
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-border/50 h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Operations Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center min-h-[250px]">
                {opsSeries.some(val => val > 0) ? (
                  <Chart options={opsOptions} series={opsSeries} type="polarArea" height="100%" width="100%" />
                ) : (
                  <div className="text-muted-foreground">No operations data.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Vehicle Type Summary Chart */}
      {vTypeSummary.length > 0 && (
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Listings by Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <Chart options={vehicleTypeOptions} series={vehicleTypeSeries} type="bar" height="100%" width="100%" />
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default AdminDashboard;
