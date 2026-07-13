import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Home, Hash, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

const ProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
  });

  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  // Fetch countries on component load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await authService.getCountries();
        setCountriesList(data || []);
      } catch (err) {
        console.error('Failed to load countries:', err);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states and cities when user data is available and countriesList is loaded
  useEffect(() => {
    const loadSavedData = async () => {
      if (user && countriesList.length > 0) {
        const countryId = user.country || '';
        const stateId = user.state || '';
        const cityId = user.city || '';

        setFormData({
          full_name: user.full_name || '',
          country: countryId,
          state: stateId,
          city: cityId,
          address: user.address || '',
          pincode: user.pincode || '',
        });

        const countryObj = countriesList.find(
          (c) => String(c.id) === String(countryId) || c.name === countryId
        );
        const countryName = countryObj ? countryObj.name : '';

        if (countryName) {
          try {
            const statesData = await authService.getStates(countryName);
            setStatesList(statesData || []);

            const stateObj = statesData.find(
              (s) => String(s.id) === String(stateId) || s.name === stateId
            );
            const stateName = stateObj ? stateObj.name : '';

            if (stateName) {
              const citiesData = await authService.getCities(
                countryName,
                stateName
              );
              setCitiesList(citiesData || []);
            }
          } catch (err) {
            console.error('Failed to load state/city details:', err);
          }
        }
      }
    };

    loadSavedData();
  }, [user, countriesList]);

  // Resolve display names from IDs
  const getCountryName = () => {
    const c = countriesList.find(
      (item) => String(item.id) === String(formData.country) || item.name === formData.country
    );
    return c ? c.name : formData.country || '';
  };

  const getStateName = () => {
    const s = statesList.find(
      (item) => String(item.id) === String(formData.state) || item.name === formData.state
    );
    return s ? s.name : formData.state || '';
  };

  const getCityName = () => {
    const c = citiesList.find(
      (item) => String(item.id) === String(formData.city) || item.name === formData.city
    );
    return c ? c.name : formData.city || '';
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-2">
      {/* Profile Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-7 sm:p-10">
        <div className="space-y-6">
          {/* Account Metadata */}
          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Account Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Verified Channel
                </label>
                <div className="px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground text-sm font-medium">
                  {user?.phone ? `Phone: +91 ${user.phone}` : `Email: ${user?.email}`}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  User Role
                </label>
                <div className="px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground text-sm font-semibold">
                  {user?.role || 'BUYER'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Fields - Read Only */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Personal Details
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="flex items-center rounded-xl border border-border bg-background overflow-hidden">
                <div className="pl-4 pr-1 text-muted-foreground">
                  <User size={18} />
                </div>
                <div className="w-full px-3 py-3.5 text-foreground text-sm font-medium">
                  {formData.full_name || <span className="text-muted-foreground">Not set</span>}
                </div>
              </div>
            </div>

            {/* Country & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Country
                </label>
                <div className="relative rounded-xl border border-border bg-background overflow-hidden">
                  <div className="w-full px-4 py-3.5 text-foreground text-sm font-medium">
                    {getCountryName() || <span className="text-muted-foreground">Not set</span>}
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <MapPin size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State
                </label>
                <div className="relative rounded-xl border border-border bg-background overflow-hidden">
                  <div className="w-full px-4 py-3.5 text-foreground text-sm font-medium">
                    {getStateName() || <span className="text-muted-foreground">Not set</span>}
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <MapPin size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* City & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City
                </label>
                <div className="relative rounded-xl border border-border bg-background overflow-hidden">
                  <div className="w-full px-4 py-3.5 text-foreground text-sm font-medium">
                    {getCityName() || <span className="text-muted-foreground">Not set</span>}
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <MapPin size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pincode
                </label>
                <div className="flex items-center rounded-xl border border-border bg-background overflow-hidden">
                  <div className="pl-4 pr-1 text-muted-foreground">
                    <Hash size={18} />
                  </div>
                  <div className="w-full px-3 py-3.5 text-foreground text-sm font-medium">
                    {formData.pincode || <span className="text-muted-foreground">Not set</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Street Address
              </label>
              <div className="flex rounded-xl border border-border bg-background overflow-hidden">
                <div className="pl-4 pr-1 pt-3.5 text-muted-foreground self-start">
                  <Home size={18} />
                </div>
                <div className="w-full px-3 py-3.5 text-foreground text-sm font-medium min-h-[80px]">
                  {formData.address || <span className="text-muted-foreground">Not set</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard/user')}
              className="w-full sm:w-auto px-6 py-3 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors order-2 sm:order-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/user/profile/edit')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-foreground hover:bg-foreground/90 text-background active:scale-[0.98] shadow-sm"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-1.5 mt-8 text-xs text-muted-foreground">
        <ShieldCheck size={14} className="text-primary" />
        <span>All data is securely validated and encrypted</span>
      </div>
    </div>
  );
};

export default ProfileView;
