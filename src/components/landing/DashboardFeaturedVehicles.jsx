import React, { useEffect, useState } from 'react';
import VehicleCard from '../vehicle/VehicleCard';
import { ArrowRight, Loader2, Search, Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleService, wishlistService } from '../../services/api';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '../ui/dropdown-menu';

const MultiSelectDropdown = ({ title, options, selected, onChange, disabled }) => {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const displayText = selected.length === 0
    ? `Any ${title}`
    : options.filter(o => selected.includes(o.id)).map(o => o.name).join(', ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-background/50 py-2 px-2.5 text-sm outline-none focus-visible:ring-3 disabled:opacity-50 disabled:cursor-not-allowed h-9">
        <span className="truncate">{displayText || `Any ${title}`}</span>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto" align="start">
        {options.map(opt => (
          <DropdownMenuCheckboxItem
            key={opt.id}
            checked={selected.includes(opt.id)}
            onCheckedChange={() => toggle(opt.id)}
          >
            {opt.name}
          </DropdownMenuCheckboxItem>
        ))}
        {options.length === 0 && (
          <div className="px-2 py-2 text-sm text-muted-foreground">No options available</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SingleSelectDropdown = ({ title, options, selected, onChange, disabled }) => {
  const selectedOpt = options.find(o => o.id === selected);
  const displayText = selectedOpt ? selectedOpt.name : `Any ${title}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-background/50 py-2 px-2.5 text-sm outline-none focus-visible:ring-3 disabled:opacity-50 disabled:cursor-not-allowed h-9">
        <span className="truncate">{displayText}</span>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto" align="start">
        <DropdownMenuRadioGroup value={selected} onValueChange={onChange}>
          <DropdownMenuRadioItem value="ALL">Any {title}</DropdownMenuRadioItem>
          {options.map(opt => (
            <DropdownMenuRadioItem key={opt.id} value={opt.id}>
              {opt.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DashboardFeaturedVehicles = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Multi-select states (arrays of IDs)
  const [filterType, setFilterType] = useState([]);
  const [filterBrand, setFilterBrand] = useState([]);
  const [filterModel, setFilterModel] = useState([]);
  const [filterVariant, setFilterVariant] = useState([]);
  const [filterFuel, setFilterFuel] = useState([]);
  const [filterTransmission, setFilterTransmission] = useState([]);

  // Single-select states
  const [filterPrice, setFilterPrice] = useState('ALL');
  const [ordering, setOrdering] = useState('ALL');

  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Metadata for dropdowns
  const [vehicleTypesList, setVehicleTypesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [modelsList, setModelsList] = useState([]);
  const [variantsList, setVariantsList] = useState([]);
  const [fuelTypesList, setFuelTypesList] = useState([]);
  const [transmissionTypesList, setTransmissionTypesList] = useState([]);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState([]);

  // Fetch wishlist
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    const fetchModels = async () => {
      if (filterBrand.length > 0) {
        try {
          const promises = filterBrand.map(id => vehicleService.getModels(id));
          const results = await Promise.all(promises);
          // Flatten and deduplicate models if backend returns any overlap (unlikely but safe)
          const allModels = results.flat();
          const uniqueModels = Array.from(new Map(allModels.map(m => [m.id, m])).values());
          setModelsList(uniqueModels);
        } catch (error) {
          console.error('Failed to fetch models:', error);
        }
      } else {
        setModelsList([]);
        setFilterModel([]);
      }
    };
    fetchModels();
  }, [filterBrand]);

  // Fetch Variants when Model changes
  useEffect(() => {
    const fetchVariants = async () => {
      if (filterModel.length > 0) {
        try {
          const promises = filterModel.map(id => vehicleService.getVariants(id));
          const results = await Promise.all(promises);
          const allVariants = results.flat();
          const uniqueVariants = Array.from(new Map(allVariants.map(v => [v.id, v])).values());
          setVariantsList(uniqueVariants);
        } catch (error) {
          console.error('Failed to fetch variants:', error);
        }
      } else {
        setVariantsList([]);
        setFilterVariant([]);
      }
    };
    fetchVariants();
  }, [filterModel]);

  // Fetch Vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', 1);
        params.append('page_size', 1000);

        if (debouncedSearch) params.append('search', debouncedSearch);
        if (filterType.length > 0) params.append('vehicle_type_id', filterType.join(','));
        if (filterBrand.length > 0) params.append('brand_id', filterBrand.join(','));
        if (filterModel.length > 0) params.append('model_id', filterModel.join(','));
        if (filterVariant.length > 0) params.append('variant_id', filterVariant.join(','));
        if (filterFuel.length > 0) params.append('fuel_type_id', filterFuel.join(','));
        if (filterTransmission.length > 0) params.append('transmission_type_id', filterTransmission.join(','));

        if (filterPrice !== 'ALL') {
          if (filterPrice === 'under1') params.append('max_price', 100000);
          else if (filterPrice === '1to5') { params.append('min_price', 100000); params.append('max_price', 500000); }
          else if (filterPrice === '5to10') { params.append('min_price', 500000); params.append('max_price', 1000000); }
          else if (filterPrice === 'over10') params.append('min_price', 1000000);
        }

        if (ordering && ordering !== 'ALL') params.append('ordering', ordering);

        const responseData = await vehicleService.getListingsDetails(params);
        
        let results = [];
        let count = 0;
        let next = null;
        let prev = null;

        const payload = responseData.data || responseData;

        if (payload && typeof payload === 'object') {
          if (Array.isArray(payload)) {
            results = payload;
            count = payload.length;
          } else if (payload.results) {
            results = payload.results;
            count = payload.count || results.length;
            next = payload.next;
            prev = payload.previous;
          }
        }

        // Setup pagination info
        setTotalPages(Math.ceil(count / 12) || 1);
        setHasNext(Boolean(next));
        setHasPrev(Boolean(prev));

        const formattedVehicles = results.map((item) => {
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
  }, [debouncedSearch, filterType, filterBrand, filterModel, filterVariant, filterFuel, filterTransmission, filterPrice, ordering, page]);

  const clearFilters = () => {
    setFilterType([]);
    setFilterBrand([]);
    setFilterModel([]);
    setFilterFuel([]);
    setFilterTransmission([]);
    setFilterPrice('ALL');
    setFilterVariant([]);
    setSearchQuery('');
    setOrdering('ALL');
    setPage(1);
  };

  const updateMultiFilter = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  const updateSingleFilter = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  const handleToggleWishlist = async (e, vehicleId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to add to wishlist");
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
          <div className="flex bg-muted p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar shrink-0 border border-border/50">
            {[{ id: 'ALL', name: 'All' }, ...vehicleTypesList].map(type => {
              const isSelected = type.id === 'ALL' ? filterType.length === 0 : filterType.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setFilterType(type.id === 'ALL' ? [] : [type.id]);
                    setPage(1);
                  }}
                  className={`flex-1 sm:flex-none whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${isSelected
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {type.name === 'All' ? 'All' : type.name === 'Other' ? 'Others' : `${type.name}s`}
                </button>
              );
            })}
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
              className={`flex items-center justify-center h-10 px-3 rounded-md border shadow-sm transition-colors ${showFilters || filterFuel.length > 0 || filterTransmission.length > 0 || filterPrice !== 'ALL' || filterVariant.length > 0 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-background border-border/60 text-muted-foreground hover:bg-muted'}`}
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
            {(filterType.length > 0 || filterBrand.length > 0 || filterModel.length > 0 || filterVariant.length > 0 || filterFuel.length > 0 || filterTransmission.length > 0 || filterPrice !== 'ALL' || ordering !== 'ALL') && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-md">
                <X className="h-3 w-3" /> Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            {/* Vehicle Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Type</label>
              <MultiSelectDropdown
                title="Type"
                options={vehicleTypesList}
                selected={filterType}
                onChange={updateMultiFilter(setFilterType)}
              />
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand</label>
              <MultiSelectDropdown
                title="Brand"
                options={brandsList}
                selected={filterBrand}
                onChange={updateMultiFilter(setFilterBrand)}
              />
            </div>

            {/* Model */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</label>
              <MultiSelectDropdown
                title="Model"
                options={modelsList}
                selected={filterModel}
                onChange={updateMultiFilter(setFilterModel)}
                disabled={filterBrand.length === 0 || modelsList.length === 0}
              />
            </div>

            {/* Variant */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variant</label>
              <MultiSelectDropdown
                title="Variant"
                options={variantsList}
                selected={filterVariant}
                onChange={updateMultiFilter(setFilterVariant)}
                disabled={filterModel.length === 0 || variantsList.length === 0}
              />
            </div>

            {/* Fuel Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fuel Type</label>
              <MultiSelectDropdown
                title="Fuel"
                options={fuelTypesList}
                selected={filterFuel}
                onChange={updateMultiFilter(setFilterFuel)}
              />
            </div>

            {/* Transmission */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transmission</label>
              <MultiSelectDropdown
                title="Transmission"
                options={transmissionTypesList}
                selected={filterTransmission}
                onChange={updateMultiFilter(setFilterTransmission)}
              />
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price Range</label>
              <SingleSelectDropdown
                title="Price"
                options={[
                  { id: 'under1', name: 'Under ₹1 Lakh' },
                  { id: '1to5', name: '₹1 Lakh - ₹5 Lakhs' },
                  { id: '5to10', name: '₹5 Lakhs - ₹10 Lakhs' },
                  { id: 'over10', name: 'Over ₹10 Lakhs' }
                ]}
                selected={filterPrice}
                onChange={updateSingleFilter(setFilterPrice)}
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort By</label>
              <SingleSelectDropdown
                title="Sort"
                options={[
                  { id: 'price_low', name: 'Price: Low to High' },
                  { id: 'price_high', name: 'Price: High to Low' },
                  { id: 'year_new', name: 'Year: Newest' },
                  { id: 'year_old', name: 'Year: Oldest' }
                ]}
                selected={ordering}
                onChange={updateSingleFilter(setOrdering)}
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : vehicles.length > 0 ? (
        <>
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

        </>
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
