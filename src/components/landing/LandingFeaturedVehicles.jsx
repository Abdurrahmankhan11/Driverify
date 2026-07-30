import React, { useEffect, useState } from 'react';
import VehicleCard from '../vehicle/VehicleCard';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleService, wishlistService } from '../../services/api';

const LandingFeaturedVehicles = ({ isDashboard = false, hideTitle = false }) => {
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
        const data = await vehicleService.getFeaturedListings();

        const formattedVehicles = (Array.isArray(data) ? data : (data.results || [])).map((item) => {
          const frontImage = item.images?.find(img => img.image_type?.toLowerCase() === 'exterior' || img.image_type?.toLowerCase() === 'front');
          const displayImage = frontImage ? frontImage.image_url : (item.images?.[0]?.image_url || 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image');

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
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleViewAll = () => {
    if (isAuthenticated && user?.role === 'USER') {
      navigate('/dashboard/user/listings');
    } else {
      navigate('/login');
    }
  };

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
    <section id="featured-vehicles" className="py-16 bg-background scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {!hideTitle && (
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-border pb-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
                Featured Owner-Listed Vehicles
              </h2>
              <p className="text-muted-foreground">
                Browse cars and bikes posted directly by vehicle owners.
              </p>
            </div>
            <button onClick={handleViewAll} className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1">
              View All Vehicles
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

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
            <p className="text-muted-foreground">No vehicles listed currently.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default LandingFeaturedVehicles;
