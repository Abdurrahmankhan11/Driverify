import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Car, IndianRupee, Loader2 } from 'lucide-react';
import { vehicleService } from '../../services/api';

const AdminListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const data = await vehicleService.getListingsDetails();
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch admin listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllListings();
  }, []);

  const formatPrice = (price) => {
    const val = parseFloat(price);
    if (isNaN(val)) return price;
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Listings</h1>
          <p className="text-muted-foreground">Manage and view all vehicle listings on the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((car) => {
            const displayImage = car.images?.[0]?.image_url;
            return (
              <Card 
                key={car.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full"
              >
                <div className="h-48 bg-muted flex items-center justify-center border-b border-border overflow-hidden relative shrink-0">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={`${car.brand} ${car.model}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Car className="h-16 w-16 text-muted-foreground/50" />
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {car.brand} {car.model} {car.variant}
                    </h3>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider shrink-0 ${
                      car.status === 'ACTIVE' || car.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {car.status || 'Pending'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 mb-4 text-sm text-muted-foreground">
                    <p>Year: <span className="font-medium text-foreground">{car.year}</span></p>
                    <p>Driven: <span className="font-medium text-foreground">{car.kilometers_driven?.toLocaleString('en-IN') || 'N/A'} km</span></p>
                    <p>Fuel: <span className="font-medium text-foreground">{car.fuel_type}</span></p>
                    <p>Trans: <span className="font-medium text-foreground">{car.transmission}</span></p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center text-xl font-bold text-primary border-t border-border pt-4">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {formatPrice(car.price)}
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button variant="outline" className="flex-1 text-xs sm:text-sm" onClick={() => navigate(`/dashboard/admin/listings/${car.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {listings.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card">
              <Car className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-1">No listings found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">There are currently no vehicle listings on the platform.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminListings;
