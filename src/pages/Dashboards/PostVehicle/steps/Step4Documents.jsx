import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { vehicleService } from '../../../../services/api';

const Step4Documents = ({ listingId, onNext }) => {
  const [serviceHistoryTypes, setServiceHistoryTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  
  // State for Service History
  const [serviceDoc, setServiceDoc] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [isUploadingService, setIsUploadingService] = useState(false);
  const [serviceMsg, setServiceMsg] = useState('');

  // State for History Document
  const [historyDoc, setHistoryDoc] = useState(null);
  const [historyType, setHistoryType] = useState('');
  const [isUploadingHistory, setIsUploadingHistory] = useState(false);
  const [historyMsg, setHistoryMsg] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const sRes = await vehicleService.getServiceHistoryTypes();
        const dRes = await vehicleService.getDocumentTypes();
        setServiceHistoryTypes(sRes || []);
        setDocumentTypes(dRes || []);
      } catch (err) {
        console.error('Failed to fetch document types', err);
      }
    };
    fetchMetadata();
  }, []);

  const handleUploadService = async (e) => {
    e.preventDefault();
    if (!serviceDoc || !serviceType || !serviceDate) return;

    setIsUploadingService(true);
    setServiceMsg('');

    const formData = new FormData();
    // Assuming backend takes the name. If it needs ID, use ID. 
    // Data sample says: "service_history_type: Regular Service"
    formData.append('service_history_type', serviceType);
    formData.append('service_date', serviceDate);
    formData.append('document', serviceDoc);

    try {
      await vehicleService.uploadServiceHistory(listingId, formData);
      setServiceMsg('Service history document uploaded successfully!');
      setServiceDoc(null);
      setServiceType('');
      setServiceDate('');
      // Reset file input
      document.getElementById('service_file').value = '';
    } catch (err) {
      console.error(err);
      setServiceMsg('Failed to upload service history.');
    } finally {
      setIsUploadingService(false);
    }
  };

  const handleUploadHistory = async (e) => {
    e.preventDefault();
    if (!historyDoc || !historyType) return;

    setIsUploadingHistory(true);
    setHistoryMsg('');

    const formData = new FormData();
    // Data sample says: "history_document_type: Insurance"
    formData.append('history_document_type', historyType);
    formData.append('document', historyDoc);

    try {
      await vehicleService.uploadHistoryDocument(listingId, formData);
      setHistoryMsg('Vehicle history document uploaded successfully!');
      setHistoryDoc(null);
      setHistoryType('');
      // Reset file input
      document.getElementById('history_file').value = '';
    } catch (err) {
      console.error(err);
      setHistoryMsg('Failed to upload vehicle history document.');
    } finally {
      setIsUploadingHistory(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg text-foreground mb-1">Documents (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          Upload any available service history or vehicle history documents (like Insurance, RC).
          You can skip this step if you don't have them right now.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service History Form */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h4 className="font-medium text-foreground mb-4">Service History</h4>
          <form onSubmit={handleUploadService} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <select 
                value={serviceType} 
                onChange={(e) => setServiceType(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Service Type</option>
                {serviceHistoryTypes.map((type, i) => (
                  <option key={i} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Date</label>
              <Input 
                type="date" 
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Document File</label>
              <Input 
                id="service_file"
                type="file" 
                accept=".pdf,image/*"
                onChange={(e) => setServiceDoc(e.target.files[0])}
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={isUploadingService || !serviceDoc || !serviceType || !serviceDate}
              className="w-full"
            >
              {isUploadingService ? 'Uploading...' : 'Upload Service Document'}
            </Button>
            {serviceMsg && <p className="text-xs text-primary mt-2">{serviceMsg}</p>}
          </form>
        </div>

        {/* Vehicle History Form */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h4 className="font-medium text-foreground mb-4">Vehicle History Document</h4>
          <form onSubmit={handleUploadHistory} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <select 
                value={historyType} 
                onChange={(e) => setHistoryType(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Document Type</option>
                {documentTypes.map((type, i) => (
                  <option key={i} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Document File</label>
              <Input 
                id="history_file"
                type="file" 
                accept=".pdf,image/*"
                onChange={(e) => setHistoryDoc(e.target.files[0])}
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={isUploadingHistory || !historyDoc || !historyType}
              className="w-full mt-auto"
            >
              {isUploadingHistory ? 'Uploading...' : 'Upload History Document'}
            </Button>
            {historyMsg && <p className="text-xs text-primary mt-2">{historyMsg}</p>}
          </form>
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-border mt-6">
        <Button 
          type="button" 
          onClick={onNext}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Next: Review
        </Button>
      </div>
    </div>
  );
};

export default Step4Documents;
