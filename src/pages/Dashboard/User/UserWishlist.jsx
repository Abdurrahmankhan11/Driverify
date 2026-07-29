import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import VehicleCard from '../../../components/vehicle/VehicleCard';
import { wishlistService } from '../../../services/api';

const UserWishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.viewWishlist();
      if (res.success && res.data) {
        setWishlistItems(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (car, e) => {
    e.stopPropagation(); // Prevent card click if any
    const listingId = car.listing_id || car.listing || car.id;
    try {
      setRemovingId(car.id);
      const res = await wishlistService.removeWishlist(listingId);
      if (res.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== car.id));
      } else {
        console.error('Failed to remove:', res.message);
        alert(res.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      alert('Failed to remove from wishlist');
    } finally {
      setRemovingId(null);
    }
  };



  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground">Vehicles you have saved for later.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card mt-8">
          <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-1">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't added any vehicles to your wishlist yet. Explore our listings and save your favorites!
          </p>
          <Button 
            onClick={() => navigate('/#featured-vehicles')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Browse Vehicles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((car) => {
            const frontImage = car.images?.find(img => img.image_type?.toLowerCase() === 'exterior' || img.image_type?.toLowerCase() === 'front');
            const displayImage = frontImage ? frontImage.image_url || frontImage.image : (car.images?.[0]?.image_url || car.images?.[0]?.image || 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image');
            
            const priceValue = parseFloat(car.price);
            let displayPrice = car.price ? `₹${car.price}` : 'N/A';
            if (!isNaN(priceValue)) {
              if (priceValue >= 100000) {
                displayPrice = `₹${(priceValue / 100000).toFixed(2)} Lakh`;
              } else {
                displayPrice = `₹${priceValue.toLocaleString('en-IN')}`;
              }
            }

            const formattedVehicle = {
              id: car.listing_id || car.listing || car.id,
              type: car.vehicle_type || 'Car',
              brand: car.brand || 'Unknown',
              model: car.model || 'Unknown',
              price: displayPrice,
              city: car.location || car.city || 'N/A',
              fuelType: car.fuel_type || 'N/A',
              kilometers: car.kilometers_driven ? `${car.kilometers_driven.toLocaleString('en-IN')} km` : (car.kilometers ? `${car.kilometers.toLocaleString('en-IN')} km` : 'N/A'),
              year: car.year || 'N/A',
              transmission: car.transmission || 'N/A',
              engineCc: car.engine_cc || 'N/A',
              image: displayImage,
            };

            return (
              <div key={car.id} className="relative group">
                <VehicleCard 
                  vehicle={formattedVehicle}
                  onViewDetails={() => navigate(`/dashboard/user/vehicle/${formattedVehicle.id}`)}
                  isWishlisted={true}
                  onToggleWishlist={(e) => handleRemove(car, e)}
                />
                {removingId === car.id && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;

