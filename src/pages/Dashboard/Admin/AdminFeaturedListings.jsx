import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Car, IndianRupee, Loader2, Star } from 'lucide-react';
import { vehicleService } from '../../../services/api';
import { Switch } from '../../../components/ui/switch';
import { toast } from 'sonner';

const AdminFeaturedListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await vehicleService.getFeaturedListings();
        setListings(Array.isArray(data) ? data : (data.results || []));
      } catch (error) {
        console.error('Failed to fetch featured listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const formatPrice = (price) => {
    const val = parseFloat(price);
    if (isNaN(val)) return price;
    return val.toLocaleString('en-IN');
  };

  const handleToggleFeatured = async (carId, currentStatus) => {
    try {
      await vehicleService.toggleFeaturedListing(carId, !currentStatus);
      toast.success(currentStatus ? 'Listing removed from featured.' : 'Listing marked as featured.');
      // Remove from featured list if we unfroze it
      if (currentStatus) {
        setListings(listings.filter(listing => listing.id !== carId));
      } else {
        setListings(listings.map(listing => 
          listing.id === carId ? { ...listing, is_featured: !currentStatus } : listing
        ));
      }
    } catch (error) {
      toast.error('Failed to update featured status.');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 border-b border-border/60 pb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Featured Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage and view all featured vehicle listings.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {listings.map((car) => {
            const displayImage = car.images?.find(img => img.image_type?.toLowerCase() === 'exterior' || img.image_type?.toLowerCase() === 'front')?.image_url || car.images?.[0]?.image_url || car.images?.[0]?.image;
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
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider shrink-0 ${car.status === 'ACTIVE' || car.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {car.status || 'Pending'}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between mb-4 p-3 rounded-xl border transition-all ${
                    car.is_featured !== false 
                      ? 'bg-amber-50/50 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/50' 
                      : 'bg-muted/30 border-transparent hover:bg-muted/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-lg shadow-sm ${
                        car.is_featured !== false 
                          ? 'bg-gradient-to-br from-amber-400 to-amber-500' 
                          : 'bg-background border border-border/60'
                      }`}>
                        <Star className={`h-4 w-4 ${car.is_featured !== false ? 'fill-white text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${car.is_featured !== false ? 'text-amber-900 dark:text-amber-400' : 'text-foreground'}`}>
                          Featured
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {car.is_featured !== false ? 'Promoted Listing' : 'Standard Listing'}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={car.is_featured !== false} 
                      onCheckedChange={() => handleToggleFeatured(car.id, car.is_featured !== false)} 
                      className={car.is_featured !== false ? "data-[state=checked]:bg-amber-500" : ""}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 mb-4 text-sm text-muted-foreground">
                    <p>Year: <span className="font-medium text-foreground">{car.year}</span></p>
                    <p>Driven: <span className="font-medium text-foreground">{car.kilometers_driven?.toLocaleString('en-IN') || car.kilometers?.toLocaleString('en-IN') || 'N/A'} km</span></p>
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
        </div>
      ) : (
        <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card">
          <Car className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-1">No featured vehicles found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Mark some listings as featured to see them here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminFeaturedListings;
