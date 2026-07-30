import React, { useEffect, useState } from 'react';
import VehicleCard from '../../../components/vehicle/VehicleCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { vehicleService, wishlistService } from '../../../services/api';

const UserRecentlyViewed = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          const res = await wishlistService.viewWishlist();
          if (res.success && res.data) {
            setWishlistIds(res.data.map(item => String(item.listing_id || item.listing || item.id)));
          }
        } catch (err) {
          console.error('Failed to fetch wishlist', err);
        }
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getRecentlyViewed();

        // Data might come wrapped in a 'data' property per the user example
        let payload = [];
        if (data && data.success && Array.isArray(data.data)) {
          payload = data.data;
        } else if (Array.isArray(data)) {
          payload = data;
        } else if (data && data.results) {
          payload = data.results;
        }

        const formattedVehicles = payload.map((item) => {
          const frontImage = item.images?.find(img => img.image_type?.toLowerCase() === 'exterior' || img.image_type?.toLowerCase() === 'front');
          const displayImage = frontImage ? (frontImage.image_url || frontImage.image) : (item.images?.[0]?.image_url || item.images?.[0]?.image || 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image');

          const priceValue = parseFloat(item.price);
          let displayPrice = item.price ? `₹${item.price}` : 'N/A';
          if (!isNaN(priceValue)) {
            if (priceValue >= 100000) {
              displayPrice = `₹${(priceValue / 100000).toFixed(2)} Lakh`;
            } else {
              displayPrice = `₹${priceValue.toLocaleString('en-IN')}`;
            }
          }

          return {
            id: item.id,
            type: item.vehicle_type || 'Car',
            brand: item.brand || 'Unknown',
            model: item.model || 'Unknown',
            price: displayPrice,
            city: item.location || item.city || 'N/A',
            fuelType: item.fuel_type || 'N/A',
            kilometers: item.kilometers_driven ? `${item.kilometers_driven.toLocaleString('en-IN')} km` : (item.kilometers ? `${item.kilometers.toLocaleString('en-IN')} km` : 'N/A'),
            year: item.year || 'N/A',
            transmission: item.transmission || 'N/A',
            engineCc: item.engine_cc || 'N/A',
            image: displayImage,
          };
        });

        setVehicles(formattedVehicles);
      } catch (error) {
        console.error('Failed to fetch recently viewed vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleToggleWishlist = async (e, vehicleId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const isW = wishlistIds.includes(String(vehicleId));
    try {
      if (isW) {
        const res = await wishlistService.removeWishlist(vehicleId);
        if (res.success) {
          setWishlistIds(prev => prev.filter(id => id !== String(vehicleId)));
        } else {
          alert(res.message || 'Failed to remove from wishlist');
        }
      } else {
        const res = await wishlistService.createWishlist(vehicleId);
        if (res.success) {
          setWishlistIds(prev => [...prev, String(vehicleId)]);
        } else {
          alert(res.message || 'Failed to add to wishlist');
        }
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      alert('Error updating wishlist');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 border-b border-border/60 pb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Recently Viewed</h1>
          <p className="text-muted-foreground mt-1">Vehicles you have recently checked out.</p>
        </div>
      </div>
      
      <div className="mt-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {vehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onViewDetails={() => isAuthenticated ? navigate(`/dashboard/user/vehicle/${vehicle.id}`) : navigate('/login')}
                isWishlisted={wishlistIds.includes(String(vehicle.id))}
                onToggleWishlist={(e) => handleToggleWishlist(e, vehicle.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-border/50">
            <p className="text-muted-foreground">You haven't viewed any vehicles recently.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRecentlyViewed;
