import React, { useEffect, useState } from 'react';
import VehicleCard from '../vehicles/VehicleCard';
import { ArrowRight, Loader2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleService } from '../../services/api';
import { Input } from '../ui/input';

const DashboardFeaturedVehicles = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Car', 'Bike'

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getListingsDetails();
        
        const formattedVehicles = data.map((item) => {
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

  const filteredVehicles = vehicles.filter((v) => {
    // Search match
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      v.brand.toLowerCase().includes(searchLower) ||
      v.model.toLowerCase().includes(searchLower) ||
      v.city.toLowerCase().includes(searchLower);

    // Type match
    const matchesType = filterType === 'All' ? true : v.type.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full">
      {/* Top Header & Search/Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 border-b border-border/60 pb-5">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            Marketplace Highlights
          </h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Browse premium pre-owned cars and bikes directly from owners.
          </p>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Filter Tabs */}
          <div className="flex bg-muted p-1 rounded-lg w-full sm:w-auto shrink-0">
            {['All', 'Car', 'Bike'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  filterType === type 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type}s
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search brand, model, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full bg-background border-border/60 shadow-sm focus-visible:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onViewDetails={() => navigate(`/dashboard/user/vehicle/${vehicle.id}`)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-card rounded-2xl border border-dashed border-border/60 shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No vehicles found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardFeaturedVehicles;
