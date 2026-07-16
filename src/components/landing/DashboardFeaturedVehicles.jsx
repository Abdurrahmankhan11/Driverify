import React, { useEffect, useState } from 'react';
import VehicleCard from '../vehicles/VehicleCard';
import { ArrowRight, Loader2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleService } from '../../services/api';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SlidersHorizontal, X } from 'lucide-react';

const DashboardFeaturedVehicles = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All' or specific type name
  const [filterBrand, setFilterBrand] = useState('ALL');
  const [filterModel, setFilterModel] = useState('ALL');
  const [filterFuel, setFilterFuel] = useState('ALL');
  const [filterTransmission, setFilterTransmission] = useState('ALL');
  const [filterPrice, setFilterPrice] = useState('ALL');
  const [filterVariant, setFilterVariant] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Metadata for dropdowns
  const [vehicleTypesList, setVehicleTypesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [modelsList, setModelsList] = useState([]);
  const [variantsList, setVariantsList] = useState([]);
  const [fuelTypesList, setFuelTypesList] = useState([]);
  const [transmissionTypesList, setTransmissionTypesList] = useState([]);

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
            variant: item.variant || 'N/A',
            rawPrice: isNaN(priceValue) ? 0 : priceValue,
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

  // Fetch initial metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [vtRes, bRes, ftRes, ttRes] = await Promise.all([
          vehicleService.getVehicleTypes(),
          vehicleService.getBrands(),
          vehicleService.getFuelTypes(),
          vehicleService.getTransmissionTypes(),
        ]);
        setVehicleTypesList(vtRes || []);
        setBrandsList(bRes || []);
        setFuelTypesList(ftRes || []);
        setTransmissionTypesList(ttRes || []);
      } catch (err) {
        console.error('Failed to fetch metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Models when Brand changes
  useEffect(() => {
    if (filterBrand !== 'ALL') {
      const brandObj = brandsList.find(b => b.name === filterBrand);
      if (brandObj) {
        vehicleService.getModels(brandObj.id).then(res => setModelsList(res || [])).catch(console.error);
      }
    } else {
      setModelsList([]);
      setFilterModel('ALL');
    }
  }, [filterBrand, brandsList]);

  // Fetch Variants when Model changes
  useEffect(() => {
    if (filterModel !== 'ALL') {
      const modelObj = modelsList.find(m => m.name === filterModel);
      if (modelObj) {
        vehicleService.getVariants(modelObj.id).then(res => setVariantsList(res || [])).catch(console.error);
      }
    } else {
      setVariantsList([]);
      setFilterVariant('ALL');
    }
  }, [filterModel, modelsList]);

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

    // Brand match
    const matchesBrand = filterBrand === 'ALL' ? true : v.brand === filterBrand;

    // Model match
    const matchesModel = filterModel === 'ALL' ? true : v.model === filterModel;

    // Fuel match
    const matchesFuel = filterFuel === 'ALL' ? true : v.fuelType === filterFuel;

    // Transmission match
    const matchesTransmission = filterTransmission === 'ALL' ? true : v.transmission === filterTransmission;

    // Variant match
    const matchesVariant = filterVariant === 'ALL' ? true : v.variant === filterVariant;

    // Price match
    let matchesPrice = true;
    if (filterPrice !== 'ALL') {
      if (filterPrice === 'under1') matchesPrice = v.rawPrice < 100000;
      else if (filterPrice === '1to5') matchesPrice = v.rawPrice >= 100000 && v.rawPrice <= 500000;
      else if (filterPrice === '5to10') matchesPrice = v.rawPrice > 500000 && v.rawPrice <= 1000000;
      else if (filterPrice === 'over10') matchesPrice = v.rawPrice > 1000000;
    }

    return matchesSearch && matchesType && matchesBrand && matchesModel && matchesFuel && matchesTransmission && matchesVariant && matchesPrice;
  });

  const clearFilters = () => {
    setFilterType('All');
    setFilterBrand('ALL');
    setFilterModel('ALL');
    setFilterFuel('ALL');
    setFilterTransmission('ALL');
    setFilterPrice('ALL');
    setFilterVariant('ALL');
    setSearchQuery('');
  };

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
          {/* Filter Tabs (Vehicle Type Shortcut) */}
          <div className="flex bg-muted p-1 rounded-lg w-full sm:w-auto shrink-0 border border-border/50">
            {['All', ...vehicleTypesList.map(vt => vt.name)].slice(0, 3).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  filterType.toLowerCase() === type.toLowerCase()
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type === 'All' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>

          {/* Search Input & Advanced Filters Toggle */}
          <div className="flex gap-2 w-full sm:w-auto">
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
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center h-10 px-3 rounded-md border shadow-sm transition-colors ${showFilters || filterFuel !== 'ALL' || filterTransmission !== 'ALL' || filterPrice !== 'ALL' || filterVariant !== 'ALL' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-background border-border/60 text-muted-foreground hover:bg-muted'}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-card border border-border/60 p-5 rounded-xl shadow-sm mb-8 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-5 border-b border-border/40 pb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" /> Advanced Filters
            </h3>
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-md">
              <X className="h-3 w-3" /> Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            {/* Vehicle Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full h-9 bg-background/50">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Any Type</SelectItem>
                  {vehicleTypesList.map(vt => (
                    <SelectItem key={vt.id} value={vt.name}>{vt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand</label>
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger className="w-full h-9 bg-background/50">
                  <SelectValue placeholder="Any Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Brand</SelectItem>
                  {brandsList.map(b => (
                    <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</label>
              <Select value={filterModel} onValueChange={setFilterModel} disabled={filterBrand === 'ALL' || modelsList.length === 0}>
                <SelectTrigger className="w-full h-9 bg-background/50">
                  <SelectValue placeholder="Any Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Model</SelectItem>
                  {modelsList.map(m => (
                    <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Variant */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variant</label>
              <Select value={filterVariant} onValueChange={setFilterVariant} disabled={filterModel === 'ALL' || variantsList.length === 0}>
                <SelectTrigger className="w-full h-9 bg-background/50">
                  <SelectValue placeholder="Any Variant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Variant</SelectItem>
                  {variantsList.map(v => (
                    <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fuel Type</label>
              <Select value={filterFuel} onValueChange={setFilterFuel}>
                <SelectTrigger className="w-full h-9 bg-background/50">
                  <SelectValue placeholder="Any Fuel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Fuel</SelectItem>
                  {fuelTypesList.map(f => (
                    <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transmission</label>
              <Select value={filterTransmission} onValueChange={setFilterTransmission}>
                <SelectTrigger className="w-full h-9 bg-background/50">
                  <SelectValue placeholder="Any Transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Transmission</SelectItem>
                  {transmissionTypesList.map(t => (
                    <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price Range</label>
              <Select value={filterPrice} onValueChange={setFilterPrice}>
                <SelectTrigger className="w-full h-9 bg-background/50">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Price</SelectItem>
                  <SelectItem value="under1">Under ₹1 Lakh</SelectItem>
                  <SelectItem value="1to5">₹1 Lakh - ₹5 Lakhs</SelectItem>
                  <SelectItem value="5to10">₹5 Lakhs - ₹10 Lakhs</SelectItem>
                  <SelectItem value="over10">Over ₹10 Lakhs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

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
