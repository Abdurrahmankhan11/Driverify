import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, vehicleService } from '../../../services/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Loader2, AlertTriangle, ExternalLink, Car } from 'lucide-react';

const ReportCard = ({ report, handleStatusChange, isUpdating }) => {
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loadingListing, setLoadingListing] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await vehicleService.getListing(report.listing_id);
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing for report', err);
      } finally {
        setLoadingListing(false);
      }
    };
    if (report.listing_id) {
      fetchListing();
    }
  }, [report.listing_id]);

  const displayImage = listing?.images?.find(img => img.image_type?.toLowerCase() === 'exterior' || img.image_type?.toLowerCase() === 'front')?.image_url || listing?.images?.[0]?.image_url;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full border-border/60">
      <div className="bg-destructive/5 p-4 border-b border-destructive/10 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-destructive/10 rounded-full">
            <AlertTriangle size={18} className="text-destructive" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">Report #{report.id}</h3>
            <p className="text-xs text-muted-foreground">
              {report.created_at ? new Date(report.created_at).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : 'Unknown Date'}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
          report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          report.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-700' :
          report.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {report.status?.replace('_', ' ')}
        </span>
      </div>

      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Listing Details Section */}
        <div className="p-4 bg-muted/30 border-b border-border/50 flex gap-3 items-center">
          <div className="h-14 w-20 rounded-md bg-muted overflow-hidden shrink-0 border border-border">
            {loadingListing ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 size={14} className="animate-spin text-muted-foreground" />
              </div>
            ) : displayImage ? (
              <img src={displayImage} alt="Listing" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={16} className="text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {loadingListing ? (
              <div className="space-y-1.5">
                <div className="h-3.5 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-2.5 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            ) : listing ? (
              <>
                <h4 className="font-semibold text-sm truncate text-foreground">{listing.brand} {listing.model} {listing.variant}</h4>
                <p className="text-xs text-muted-foreground truncate">{listing.year} • {listing.fuel_type}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Listing details unavailable</p>
            )}
          </div>
        </div>

        {/* Report Details Section */}
        <div className="p-4 flex flex-col gap-4 flex-1">
          <div className="space-y-3 flex-1">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Reported By</label>
              <p className="text-sm font-medium text-foreground truncate" title={report.reported_by}>{report.reported_by}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Reason</label>
              <p className="text-sm font-semibold text-destructive">{report.reason}</p>
            </div>
            {report.description && (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Additional Details</label>
                <p className="text-sm text-foreground/80 bg-muted/50 p-2.5 rounded-lg border border-border/50 line-clamp-3" title={report.description}>
                  {report.description}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border/50 flex flex-col gap-3 mt-auto">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">Update Status:</label>
              <div className="relative">
                <select
                  value={report.status}
                  onChange={(e) => handleStatusChange(report.id, e.target.value)}
                  disabled={isUpdating}
                  className="text-sm bg-background border border-input rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 font-medium cursor-pointer"
                >
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
                {isUpdating && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-background pl-2">
                    <Loader2 size={14} className="animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-background"
              onClick={() => navigate(`/dashboard/admin/listings/${report.listing_id}`)}
            >
              View Listing <ExternalLink size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({}); // Track loading state for status updates

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReports();
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [reportId]: true }));
    try {
      const res = await adminService.updateReportStatus(reportId, newStatus);
      if (res.success) {
        setReports(prev => prev.map(report => 
          report.id === reportId ? { ...report, status: newStatus } : report
        ));
      }
    } catch (err) {
      console.error('Failed to update report status:', err);
      alert('Failed to update report status.');
    } finally {
      setStatusUpdates(prev => ({ ...prev, [reportId]: false }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reported Listings</h1>
          <p className="text-muted-foreground mt-1">Review and manage listings reported by users.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              handleStatusChange={handleStatusChange} 
              isUpdating={statusUpdates[report.id]} 
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card">
          <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-1">No reports found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            There are currently no reported listings to review.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
