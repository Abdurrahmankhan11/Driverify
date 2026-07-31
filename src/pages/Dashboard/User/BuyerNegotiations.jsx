import React, { useState, useEffect } from 'react';
import { negotiationService } from '../../../services/api';
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const BuyerNegotiations = () => {
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await negotiationService.getBuyerHistory();
        setNegotiations(Array.isArray(res) ? res : (res.data || []));
      } catch (err) {
        console.error('Failed to fetch negotiation history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
        <h1 className="text-2xl font-bold text-foreground">My Negotiations</h1>
        <p className="text-muted-foreground">Track your middleman requests and negotiation progress.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : negotiations.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
          You have not requested any middleman services yet.
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Middleman</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Final Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {negotiations.map((item) => {
                  const itemId = item.negotiation_request_id || item.id || item.request_id;
                  return (
                  <tr key={itemId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.requested_at || item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {item.vehicle_brand} {item.vehicle_model}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={item.message || ''}>
                      {item.message || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {item.middleman_name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                      {item.status === 'COMPLETED' && item.result && (
                        <div className="text-xs mt-1 text-muted-foreground">{item.result}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {item.final_price ? `₹${parseFloat(item.final_price).toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerNegotiations;
