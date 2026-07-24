import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Car, IndianRupee, Loader2, Search, Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { vehicleService } from '../../../services/api';
import { Input } from '../../../components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from '../../../components/ui/dropdown-menu';

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

const AdminListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
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

        const data = await vehicleService.getListingsDetails(params);
        
        // Setup pagination info
        const results = data.results || [];
        setTotalPages(Math.ceil((data.count || results.length) / 12));
        setHasNext(Boolean(data.next));
        setHasPrev(Boolean(data.previous));
        
        setListings(results);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
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

  const formatPrice = (price) => {
    const val = parseFloat(price);
    if (isNaN(val)) return price;
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6 border-b border-border/60 pb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">All Listings</h1>
          <p className="text-muted-foreground mt-1">Manage and view all vehicle listings on the platform.</p>
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
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {listings.map((car) => {
              const displayImage = car.images?.find(img => img.image_type?.toLowerCase() === 'exterior' || img.image_type?.toLowerCase() === 'front')?.image_url || car.images?.[0]?.image_url;
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

        </>
      ) : (
        <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card">
          <Car className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-1">No listings found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default AdminListings;
