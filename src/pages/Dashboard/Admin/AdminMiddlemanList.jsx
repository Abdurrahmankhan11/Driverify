import React, { useState, useEffect } from 'react';
import { negotiationService, adminService } from '../../../services/api';
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

const AdminMiddlemanList = () => {
  const [requests, setRequests] = useState([]);
  const [middlemen, setMiddlemen] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment State
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedMiddlemanId, setSelectedMiddlemanId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, usersRes] = await Promise.all([
        negotiationService.getAdminMiddlemanDashboard(),
        adminService.getUsers() // Fetch users, might need pagination or role filter in real app
      ]);
      setRequests(Array.isArray(reqRes) ? reqRes : (reqRes.data || []));
      
      const allUsers = Array.isArray(usersRes) ? usersRes : (usersRes.data || usersRes.results || []);
      // Filter for middlemen if role is available, otherwise just use all users for now
      const middlemanUsers = allUsers.filter(u => u.role === 'MIDDLEMAN' || u.is_staff);
      setMiddlemen(middlemanUsers.length > 0 ? middlemanUsers : allUsers);
    } catch (err) {
      console.error('Failed to fetch admin middleman data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedMiddlemanId || !selectedRequest) return;
    setAssigning(true);
    try {
      const reqId = selectedRequest.negotiation_request_id || selectedRequest.id || selectedRequest.request_id;
      if (!reqId) {
        alert("ID is still undefined. Available keys in request: " + Object.keys(selectedRequest).join(", "));
        console.error("Full request object:", selectedRequest);
        setAssigning(false);
        return;
      }
      await negotiationService.assignMiddleman(reqId, { middleman_id: selectedMiddlemanId });
      fetchData();
      setIsAssignDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to assign middleman.');
    } finally {
      setAssigning(false);
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
        <h1 className="text-2xl font-bold text-foreground">Middleman Requests</h1>
        <p className="text-muted-foreground">Monitor and assign middleman negotiation requests.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
          No middleman requests found on the platform.
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
                  <th className="px-6 py-4 font-medium">Middleman</th>
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
                    <td className="px-6 py-4">
                      {item.middleman_name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(item);
                            setSelectedMiddlemanId('');
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          Assign Middleman
                        </Button>
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

      {/* Assign Middleman Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Middleman</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Middleman</label>
              <select 
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                value={selectedMiddlemanId}
                onChange={(e) => setSelectedMiddlemanId(e.target.value)}
              >
                <option value="">-- Select a Middleman --</option>
                {middlemen.map(m => (
                  <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAssign} disabled={assigning || !selectedMiddlemanId}>
              {assigning ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMiddlemanList;
