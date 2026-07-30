import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { vehicleService, wishlistService } from '../../services/api';
import VehicleCard from './VehicleCard';
import { useAuth } from '../../context/AuthContext';

const SimilarListings = ({ listingId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    const fetchSimilar = async () => {
      if (!listingId) return;
      try {
        setLoading(true);
        const res = await vehicleService.getSimilarListings(listingId);

        // Handle potentially different response structures
        let data = [];
        if (res && res.success && Array.isArray(res.data)) {
          data = res.data;
        } else if (Array.isArray(res)) {
          data = res;
        } else if (res && res.results) {
          data = res.results;
        }

        const formattedVehicles = data.map((item) => {
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
        console.error('Failed to fetch similar listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [listingId]);

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
        }
      } else {
        const res = await wishlistService.createWishlist(vehicleId);
        if (res.success) {
          setWishlistIds(prev => [...prev, String(vehicleId)]);
        }
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 mt-12 border-t border-border">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return null; // Don't show the section if there are no similar listings
  }

  return (
    <div className="mt-12 pt-10 border-t border-border/60">
      <h2 className="text-2xl font-bold text-foreground mb-6">Similar Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {vehicles.map(vehicle => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onViewDetails={() => navigate(`/dashboard/user/vehicle/${vehicle.id}`)}
            isWishlisted={wishlistIds.includes(String(vehicle.id))}
            onToggleWishlist={(e) => handleToggleWishlist(e, vehicle.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarListings;
