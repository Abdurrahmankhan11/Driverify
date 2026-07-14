import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { vehicleService } from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';

const Step1VehicleDetails = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    vehicle_type_id: '',
    brand_id: '',
    model_id: '',
    variant_id: '',
    year: '',
    fuel_type_id: '',
    transmission_type_id: '',
    ownership_type_id: '',
    kilometers_driven: '',
    price: '',
    description: '',
    country_id: '', // Used for frontend logic to load states
    state_id: '',   // Used for frontend logic to load cities
    city_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Metadata states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [transmissionTypes, setTransmissionTypes] = useState([]);
  const [ownershipTypes, setOwnershipTypes] = useState([]);

  // Fetch initial independent metadata
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cRes, vtRes, bRes, ftRes, ttRes, otRes] = await Promise.all([
          vehicleService.getCountries(),
          vehicleService.getVehicleTypes(),
          vehicleService.getBrands(),
          vehicleService.getFuelTypes(),
          vehicleService.getTransmissionTypes(),
          vehicleService.getOwnershipTypes(),
        ]);
        setCountries(cRes || []);
        setVehicleTypes(vtRes || []);
        setBrands(bRes || []);
        setFuelTypes(ftRes || []);
        setTransmissionTypes(ttRes || []);
        setOwnershipTypes(otRes || []);
      } catch (err) {
        console.error('Failed to fetch initial metadata', err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch States when Country changes
  useEffect(() => {
    if (formData.country_id) {
      const selectedCountry = countries.find(c => c.id === formData.country_id);
      if (selectedCountry?.name) {
        vehicleService.getStates(selectedCountry.name).then(res => setStates(res || [])).catch(console.error);
      }
    } else {
      setStates([]);
    }
  }, [formData.country_id, countries]);

  // Fetch Cities when State changes
  useEffect(() => {
    if (formData.state_id && formData.country_id) {
      const selectedCountry = countries.find(c => c.id === formData.country_id);
      const selectedState = states.find(s => s.id === formData.state_id);
      
      if (selectedCountry?.name && selectedState?.name) {
        vehicleService.getCities(selectedCountry.name, selectedState.name).then(res => setCities(res || [])).catch(console.error);
      }
    } else {
      setCities([]);
    }
  }, [formData.state_id, formData.country_id, countries, states]);

  // Fetch Models when Brand changes
  useEffect(() => {
    if (formData.brand_id) {
      vehicleService.getModels(formData.brand_id).then(res => setModels(res || [])).catch(console.error);
    } else {
      setModels([]);
    }
  }, [formData.brand_id]);

  // Fetch Variants when Model changes
  useEffect(() => {
    if (formData.model_id) {
      vehicleService.getVariants(formData.model_id).then(res => setVariants(res || [])).catch(console.error);
    } else {
      setVariants([]);
    }
  }, [formData.model_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields
      ...(name === 'country_id' && { state_id: '', city_id: '' }),
      ...(name === 'state_id' && { city_id: '' }),
      ...(name === 'brand_id' && { model_id: '', variant_id: '' }),
      ...(name === 'model_id' && { variant_id: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare payload
    const payload = {
      vehicle_type_id: formData.vehicle_type_id,
      brand_id: formData.brand_id,
      model_id: formData.model_id,
      variant_id: formData.variant_id || null, // handle empty variants
      year: parseInt(formData.year) || null,
      fuel_type_id: formData.fuel_type_id,
      transmission_type_id: formData.transmission_type_id,
      ownership_type_id: formData.ownership_type_id,
      kilometers_driven: parseInt(formData.kilometers_driven) || 0,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      country_id: formData.country_id,
      state_id: formData.state_id,
      city_id: formData.city_id,
      seller_id: user?.id,
    };

    try {
      const response = await vehicleService.createListing(payload);
      if (response && response.success !== false) { 
        onSuccess(payload, response.listing_id || response.id, response.status); 
      } else {
        setError(response.message || 'Failed to create listing');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Check your network or payload.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Vehicle Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Vehicle Type</label>
          <select 
            name="vehicle_type_id" 
            value={formData.vehicle_type_id} 
            onChange={handleChange} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Type</option>
            {vehicleTypes.map(vt => <option key={vt.id} value={vt.id}>{vt.name}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Year</label>
          <Input 
            type="number" 
            name="year" 
            value={formData.year} 
            onChange={handleChange} 
            placeholder="e.g., 2023" 
            required 
            min="1900" 
            max={new Date().getFullYear()} 
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Brand</label>
          <select 
            name="brand_id" 
            value={formData.brand_id} 
            onChange={handleChange} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Model</label>
          <select 
            name="model_id" 
            value={formData.model_id} 
            onChange={handleChange} 
            required
            disabled={!formData.brand_id}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Model</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        {/* Variant */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Variant</label>
          <select 
            name="variant_id" 
            value={formData.variant_id} 
            onChange={handleChange} 
            required
            disabled={!formData.model_id}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Variant</option>
            {variants.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>

        {/* Fuel Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Fuel Type</label>
          <select 
            name="fuel_type_id" 
            value={formData.fuel_type_id} 
            onChange={handleChange} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Fuel Type</option>
            {fuelTypes.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        {/* Transmission */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Transmission</label>
          <select 
            name="transmission_type_id" 
            value={formData.transmission_type_id} 
            onChange={handleChange} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Transmission</option>
            {transmissionTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Ownership Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ownership</label>
          <select 
            name="ownership_type_id" 
            value={formData.ownership_type_id} 
            onChange={handleChange} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Ownership</option>
            {ownershipTypes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* Kilometers Driven */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Kilometers Driven</label>
          <Input 
            type="number" 
            name="kilometers_driven" 
            value={formData.kilometers_driven} 
            onChange={handleChange} 
            placeholder="e.g., 14200" 
            required 
            min="0"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Expected Price (₹)</label>
          <Input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={handleChange} 
            placeholder="e.g., 680000" 
            required 
            min="0"
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Country</label>
          <select 
            name="country_id" 
            value={formData.country_id} 
            onChange={handleChange} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Country</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* State */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">State</label>
          <select 
            name="state_id" 
            value={formData.state_id} 
            onChange={handleChange} 
            required
            disabled={!formData.country_id}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select State</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">City</label>
          <select 
            name="city_id" 
            value={formData.city_id} 
            onChange={handleChange} 
            required
            disabled={!formData.state_id}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select City</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Detailed description of the vehicle's condition, features, etc." 
          required 
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="pt-4 flex justify-end border-t border-border mt-6">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? 'Creating...' : 'Next: Upload Exterior Images'}
        </Button>
      </div>
    </form>
  );
};

export default Step1VehicleDetails;
