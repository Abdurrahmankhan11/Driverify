import React, { useState, useEffect } from 'react';
import { negotiationService } from '../../../services/api';
import { Loader2, ExternalLink, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

const MiddlemanRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Update State
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Complete Negotiation State
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState('SUCCESS');
  const [finalPrice, setFinalPrice] = useState('');
  const [remarks, setRemarks] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await negotiationService.getMiddlemanDashboard();
      setRequests(Array.isArray(res) ? res : (res.data || []));
    } catch (err) {
      console.error('Failed to fetch middleman requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || !selectedRequest) return;
    setUpdatingStatus(true);
    try {
      const reqId = selectedRequest.negotiation_request_id || selectedRequest.id || selectedRequest.request_id;
      await negotiationService.updateNegotiationStatus(reqId, { status: newStatus });
      fetchRequests();
      setIsStatusDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedRequest) return;
    setCompleting(true);
    try {
      const reqId = selectedRequest.negotiation_request_id || selectedRequest.id || selectedRequest.request_id;
      await negotiationService.completeNegotiation(reqId, {
        result: resultStatus,
        final_price: parseFloat(finalPrice) || null,
        remarks: remarks
      });
      fetchRequests();
      setIsCompleteDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to complete negotiation.');
    } finally {
      setCompleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium">Pending</span>;
      case 'ASSIGNED': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">Assigned</span>;
      case 'NEGOTIATING': return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium">Negotiating</span>;
      case 'COMPLETED': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">Completed</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assigned Requests</h1>
        <p className="text-muted-foreground">Manage and update negotiations assigned to you.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
          No requests assigned to you right now.
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Buyer</th>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((item) => {
                  const itemId = item.negotiation_request_id || item.id || item.request_id;
                  return (
                  <tr key={itemId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.requested_at || item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {item.buyer_name || 'Buyer'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {item.vehicle_brand} {item.vehicle_model}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={item.message || ''}>
                      {item.message || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {item.status !== 'COMPLETED' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(item);
                              setNewStatus(item.status);
                              setIsStatusDialogOpen(true);
                            }}
                          >
                            Update Status
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedRequest(item);
                              setResultStatus('SUCCESS');
                              setFinalPrice('');
                              setRemarks('');
                              setIsCompleteDialogOpen(true);
                            }}
                          >
                            Complete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Negotiation Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="ASSIGNED">Assigned</option>
                <option value="NEGOTIATING">Negotiating</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateStatus} disabled={updatingStatus}>
              {updatingStatus ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Negotiation Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Negotiation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Result</label>
              <select 
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                value={resultStatus}
                onChange={(e) => setResultStatus(e.target.value)}
              >
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Final Price (₹)</label>
              <input 
                type="number"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                placeholder="e.g. 450000"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Remarks</label>
              <textarea 
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                placeholder="Any final notes..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleComplete} disabled={completing}>
              {completing ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default MiddlemanRequests;
