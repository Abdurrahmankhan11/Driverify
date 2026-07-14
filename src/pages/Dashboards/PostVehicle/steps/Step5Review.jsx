import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { CheckCircle2, Car } from 'lucide-react';

const Step5Review = ({ listingId, vehicleDetails, listingStatus }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto">
      <div className="py-6 flex flex-col items-center justify-center space-y-4">
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Vehicle Listing Created!</h2>
        <p className="text-muted-foreground">
          Your vehicle details, images, and documents have been successfully saved.
        </p>
      </div>

      <div className="bg-muted p-6 rounded-xl border border-border text-left space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" /> Listing Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <span className="text-muted-foreground block">Listing ID</span>
            <span className="font-medium text-foreground text-xs">{listingId}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Status</span>
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
              listingStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {listingStatus || 'Pending'}
            </span>
          </div>
          
          {vehicleDetails && (
            <>
              <div>
                <span className="text-muted-foreground block">Year</span>
                <span className="font-medium text-foreground">{vehicleDetails.year}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Price</span>
                <span className="font-medium text-foreground">₹{vehicleDetails.price?.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Kilometers</span>
                <span className="font-medium text-foreground">{vehicleDetails.kilometers_driven?.toLocaleString('en-IN')} km</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border mt-8 flex justify-center">
        <Button 
          onClick={() => navigate('/dashboard/user/listings')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
        >
          Finish & View My Listings
        </Button>
      </div>
    </div>
  );
};

export default Step5Review;
