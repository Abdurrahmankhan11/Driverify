import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, vehicleService } from '../../../services/api';
import { Button } from '../../../components/ui/button';
import { Loader2, AlertTriangle, Car, Calendar, User, FileText, ShieldAlert, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';

const ReportCard = ({ report, handleStatusChange, isUpdating }) => {
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loadingListing, setLoadingListing] = useState(true);

  const actualListingId = typeof report.listing === 'object' ? report.listing?.id : (report.listing_id || report.listing);

  useEffect(() => {
    // If the backend already provided the populated listing object, use it directly!
    if (report.listing && typeof report.listing === 'object' && report.listing.id) {
      setListing(report.listing);
      setLoadingListing(false);
      return;
    }

    const fetchListing = async () => {
      try {
        const data = await vehicleService.getListing(actualListingId);
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing for report', err);
      } finally {
        setLoadingListing(false);
      }
    };

    // If we have a valid ID string/number, fetch it
    if (actualListingId && typeof actualListingId !== 'object') {
      fetchListing();
    } else {
      setLoadingListing(false);
    }
  }, [actualListingId, report.listing]);

  const displayImage = listing?.images?.find(img => img.image_type?.toLowerCase() === 'exterior' || img.image_type?.toLowerCase() === 'front')?.image_url || listing?.images?.[0]?.image_url;

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DISMISSED': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formattedDate = report.created_at 
    ? new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown Date';

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative">
      
      <div className="p-5 flex flex-col flex-1">
        {/* Top: Header Info */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-3 items-start min-w-0">
             <div className={`p-2.5 rounded-xl shrink-0 ${report.status === 'RESOLVED' || report.status === 'DISMISSED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {report.status === 'RESOLVED' || report.status === 'DISMISSED' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
             </div>
             <div className="min-w-0 mt-0.5">
               <h3 className="font-bold text-foreground text-sm truncate">Report #{report.id?.substring(0, 8) || 'N/A'}</h3>
               <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 truncate">
                 <Calendar size={12} className="shrink-0" /> {formattedDate}
               </p>
               <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate">
                 <User size={12} className="shrink-0" /> {report.reported_by || 'Anonymous'}
               </p>
             </div>
          </div>
          <span className={`shrink-0 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(report.status)} shadow-sm whitespace-nowrap`}>
            {report.status?.replace('_', ' ')}
          </span>
        </div>

        {/* Middle: Reason */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reason for Report</h4>
            <div className="h-px bg-border flex-1"></div>
          </div>
          <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl p-3">
             <div className="font-bold text-red-600 dark:text-red-400 text-sm mb-1">{report.reason}</div>
             {report.description && (
               <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3 mt-1.5">{report.description}</p>
             )}
          </div>
        </div>

        {/* Bottom: Target Listing */}
        <div className="mt-auto space-y-2">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reported Listing</h4>
          <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-muted/20">
            <div className="h-14 w-20 rounded-lg bg-muted overflow-hidden shrink-0 shadow-sm relative">
              {loadingListing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50"><Loader2 size={16} className="animate-spin text-muted-foreground/50"/></div>
              ) : displayImage ? (
                <img src={displayImage} alt="Listing" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50"><Car size={16} className="text-muted-foreground/30"/></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
               {loadingListing ? (
                  <div className="space-y-1.5">
                    <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-muted rounded w-1/2 animate-pulse"></div>
                  </div>
               ) : listing ? (
                  <>
                    <h5 className="font-bold text-sm text-foreground truncate">{listing.brand} {listing.model}</h5>
                    <p className="text-xs text-muted-foreground truncate">{listing.year} • {listing.fuel_type}</p>
                  </>
               ) : (
                  <p className="text-xs font-medium text-muted-foreground">Listing unavailable</p>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Action */}
      <div className="p-4 bg-muted/20 border-t border-border flex flex-col gap-4">
        <div className="w-full">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Resolution Status</label>
          <div className="relative">
            <select
              value={report.status}
              onChange={(e) => handleStatusChange(report.id, e.target.value)}
              disabled={isUpdating}
              className="w-full text-xs font-semibold bg-background border border-input rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 cursor-pointer shadow-sm appearance-none transition-colors hover:border-primary/50"
            >
              <option value="PENDING">Mark as Pending</option>
              <option value="UNDER_REVIEW">Investigating</option>
              <option value="RESOLVED">Resolve Issue</option>
              <option value="DISMISSED">Dismiss (False Alarm)</option>
            </select>
            {isUpdating ? (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Loader2 size={12} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 bg-background hover:bg-muted"
          onClick={() => navigate(`/dashboard/admin/listings/${actualListingId}`)}
        >
          View Details <ExternalLink size={16} />
        </Button>
      </div>
    </div>
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
