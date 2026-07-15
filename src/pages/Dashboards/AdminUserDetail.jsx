import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService, authService } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, User, ShieldAlert, CheckCircle2, XCircle, Mail, Phone, MapPin, Calendar, LogIn, AlertOctagon, Ban } from 'lucide-react';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [countryName, setCountryName] = useState('N/A');
  const [stateName, setStateName] = useState('N/A');
  const [cityName, setCityName] = useState('N/A');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await adminService.getUser(id);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        toast.error("User not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  useEffect(() => {
    const resolveLocations = async () => {
      if (!userData) return;
      
      let resolvedCountry = userData.country;
      let resolvedState = userData.state;
      let resolvedCity = userData.city;
      
      if (resolvedCountry) setCountryName('Loading...');
      if (resolvedState) setStateName('Loading...');
      if (resolvedCity) setCityName('Loading...');
      
      try {
        if (userData.country) {
           const countries = await authService.getCountries();
           const cObj = countries.find(c => String(c.id) === String(userData.country) || c.name === userData.country);
           if (cObj) {
             resolvedCountry = cObj.name;
             const states = await authService.getStates(cObj.name);
             const sObj = states.find(s => String(s.id) === String(userData.state) || s.name === userData.state);
             if (sObj) {
               resolvedState = sObj.name;
               const cities = await authService.getCities(cObj.name, sObj.name);
               const cityObj = cities.find(c => String(c.id) === String(userData.city) || c.name === userData.city);
               if (cityObj) {
                 resolvedCity = cityObj.name;
               }
             }
           }
        }
      } catch (err) {
         console.error('Failed to resolve location names:', err);
      } finally {
        setCountryName(resolvedCountry || 'N/A');
        setStateName(resolvedState || 'N/A');
        setCityName(resolvedCity || 'N/A');
      }
    };
    resolveLocations();
  }, [userData]);

  const handleBlockToggle = async () => {
    if (!userData) return;
    
    // Prevent blocking an admin account
    if (userData.role === 'ADMIN' && userData.is_active) {
       toast.error("Cannot block an admin account.");
       return;
    }

    try {
      setActionLoading(true);
      if (userData.is_active) {
        await adminService.blockUser(id);
        toast.success("User blocked successfully.");
        setUserData({ ...userData, is_active: false });
      } else {
        await adminService.unblockUser(id);
        toast.success("User unblocked successfully.");
        setUserData({ ...userData, is_active: true });
      }
    } catch (error) {
      console.error("Action failed", error);
      toast.error(error.response?.data?.detail || "An error occurred during this action.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading user details...</div>;
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-xl font-medium text-muted-foreground">User not found</div>
        <Button onClick={() => navigate('/dashboard/admin/users')}>Back to Users</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard/admin/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            User Details
            {!userData.is_active && (
              <Badge variant="destructive" className="ml-2 gap-1">
                <Ban className="h-3 w-3" /> Blocked
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">ID: {userData.id}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Combined Profile & Location Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{userData.full_name || 'N/A'}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={userData.role === 'ADMIN' ? 'destructive' : userData.role === 'MIDDLEMAN' ? 'secondary' : 'default'}>
                    {userData.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Joined {new Date(userData.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
              <div className="flex items-center justify-center gap-2 text-sm bg-muted/50 px-4 py-2 rounded-full border border-border/50 w-full sm:w-auto">
                <span className="font-medium text-muted-foreground">Profile Status:</span> 
                {userData.profile_complete ? (
                  <span className="text-green-600 font-semibold flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Complete</span>
                ) : (
                  <span className="text-orange-600 font-semibold flex items-center gap-1.5"><XCircle className="h-4 w-4" /> Incomplete</span>
                )}
              </div>
              <Button 
                variant={userData.is_active ? "destructive" : "default"} 
                className="gap-2 w-full sm:w-auto"
                onClick={handleBlockToggle}
                disabled={actionLoading || (userData.role === 'ADMIN' && userData.is_active)}
              >
                {actionLoading ? "Processing..." : (
                  userData.is_active ? <><Ban className="h-4 w-4" /> Block User</> : <><CheckCircle2 className="h-4 w-4" /> Unblock User</>
                )}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Details */}
              <div className="space-y-5">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border/50 pb-2">Contact Information</h3>
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2.5 rounded-md"><Phone className="h-4 w-4 text-foreground" /></div>
                  <div className="flex-1 text-sm font-medium">{userData.phone}</div>
                  {userData.is_phone_verified ? <CheckCircle2 className="h-4 w-4 text-green-500" title="Verified" /> : <XCircle className="h-4 w-4 text-red-500" title="Unverified" />}
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2.5 rounded-md"><Mail className="h-4 w-4 text-foreground" /></div>
                  <div className="flex-1 text-sm font-medium break-all">{userData.email || 'Not provided'}</div>
                  {userData.is_email_verified ? <CheckCircle2 className="h-4 w-4 text-green-500" title="Verified" /> : <XCircle className="h-4 w-4 text-red-500" title="Unverified" />}
                </div>
              </div>
              
              {/* Location & Address */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border/50 pb-2 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Location Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Country</p>
                    <p className="font-medium text-foreground">{countryName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">State</p>
                    <p className="font-medium text-foreground">{stateName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">City</p>
                    <p className="font-medium text-foreground">{cityName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Pincode</p>
                    <p className="font-medium text-foreground">{userData.pincode || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-1 pt-4 mt-2 border-t border-border/50">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Address</p>
                  <p className="font-medium text-foreground leading-relaxed">{userData.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-muted-foreground" /> 
              Security & Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border">
                <LogIn className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{userData.total_logins}</div>
                <div className="text-xs text-muted-foreground mt-1">Total Logins</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                <AlertOctagon className="h-6 w-6 text-red-500 mb-2" />
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{userData.failed_logins}</div>
                <div className="text-xs text-muted-foreground text-red-600/80 dark:text-red-400/80 mt-1">Failed Attempts</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border">
                <Calendar className="h-6 w-6 text-muted-foreground mb-2" />
                <div className="text-sm font-medium text-center">
                  {userData.last_login_at ? new Date(userData.last_login_at).toLocaleString() : 'Never logged in'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Last Login</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetail;
