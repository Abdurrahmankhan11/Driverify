import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="pb-4 border-b">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{userData.full_name || 'N/A'}</CardTitle>
                  <p className="text-sm text-muted-foreground">{userData.role}</p>
                </div>
              </div>
              <Badge variant={userData.role === 'ADMIN' ? 'destructive' : userData.role === 'MIDDLEMAN' ? 'secondary' : 'default'}>
                {userData.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 text-sm font-medium">{userData.phone}</div>
              {userData.is_phone_verified ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 text-sm font-medium">{userData.email || 'Not provided'}</div>
              {userData.is_email_verified ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">Joined on {new Date(userData.created_at).toLocaleDateString()}</div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border/50">
              <Button 
                variant={userData.is_active ? "destructive" : "default"} 
                className="w-full gap-2"
                onClick={handleBlockToggle}
                disabled={actionLoading || (userData.role === 'ADMIN' && userData.is_active)}
              >
                {actionLoading ? "Processing..." : (
                  userData.is_active ? <><Ban className="h-4 w-4" /> Block User</> : <><CheckCircle2 className="h-4 w-4" /> Unblock User</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Location details */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" /> 
                Location & Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country ID</p>
                <p className="mt-1">{userData.country || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">State ID</p>
                <p className="mt-1">{userData.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">City ID</p>
                <p className="mt-1">{userData.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pincode</p>
                <p className="mt-1">{userData.pincode || 'N/A'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="mt-1">{userData.address || 'N/A'}</p>
              </div>
              <div className="sm:col-span-2 mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">Profile Status:</span> 
                  {userData.profile_complete ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">Complete</Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">Incomplete</Badge>
                  )}
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
                  <div className="text-xs text-muted-foreground">Total Logins</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                  <AlertOctagon className="h-6 w-6 text-red-500 mb-2" />
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{userData.failed_logins}</div>
                  <div className="text-xs text-muted-foreground text-red-600/80 dark:text-red-400/80">Failed Attempts</div>
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
    </div>
  );
};

export default AdminUserDetail;
