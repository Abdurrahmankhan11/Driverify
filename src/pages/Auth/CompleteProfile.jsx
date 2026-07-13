import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Home, Hash, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

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

  const [errors, setErrors] = useState({});
  const [nonFieldErrors, setNonFieldErrors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;

    setErrors((prev) => ({ ...prev, country: '', state: '', city: '' }));
    setNonFieldErrors([]);

    setFormData((prev) => ({
      ...prev,
      country: countryId,
      state: '',
      city: '',
    }));

    setStatesList([]);
    setCitiesList([]);

    const countryObj = countriesList.find(
      (c) => String(c.id) === String(countryId) || c.name === countryId
    );
    const countryName = countryObj ? countryObj.name : '';

    if (countryName) {
      try {
        const data = await authService.getStates(countryName);
        setStatesList(data || []);
      } catch (err) {
        console.error('Failed to load states:', err);
      }
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;

    setErrors((prev) => ({ ...prev, state: '', city: '' }));
    setNonFieldErrors([]);

    setFormData((prev) => ({
      ...prev,
      state: stateId,
      city: '',
    }));

    setCitiesList([]);

    const countryObj = countriesList.find(
      (c) => String(c.id) === String(formData.country) || c.name === formData.country
    );
    const countryName = countryObj ? countryObj.name : '';

    const stateObj = statesList.find(
      (s) => String(s.id) === String(stateId) || s.name === stateId
    );
    const stateName = stateObj ? stateObj.name : '';

    if (countryName && stateName) {
      try {
        const data = await authService.getCities(countryName, stateName);
        setCitiesList(data || []);
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: '' }));
    setNonFieldErrors([]);

    if (name === 'pincode') {
      const sanitized = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const tempErrors = {};

    if (!formData.full_name.trim()) tempErrors.full_name = 'Full name is required';
    if (!formData.country) tempErrors.country = 'Please select a country';
    if (!formData.state) tempErrors.state = 'Please select a state';
    if (!formData.city) tempErrors.city = 'Please select a city';
    if (!formData.address.trim()) tempErrors.address = 'Address is required';

    if (!formData.pincode) {
      tempErrors.pincode = 'Pincode is required';
    } else if (formData.pincode.length !== 6) {
      tempErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});
    setNonFieldErrors([]);
    setSuccessMessage('');

    const payload = {
      full_name: formData.full_name.trim(),
      country: formData.country,
      state: formData.state,
      city: formData.city,
      address: formData.address.trim(),
      pincode: formData.pincode,
    };

    try {
      const response = await authService.updateProfile(payload);
      updateUser(response);
      setSuccessMessage('Profile saved successfully!');

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        const data = err.response.data;
        const responseErrors = {};

        if (data.non_field_errors) {
          setNonFieldErrors(data.non_field_errors);
        }

        Object.keys(data).forEach((key) => {
          if (key !== 'non_field_errors') {
            responseErrors[key] = Array.isArray(data[key])
              ? data[key][0]
              : data[key];
          }
        });

        setErrors(responseErrors);
      } else {
        setNonFieldErrors([
          'An unexpected error occurred while saving. Please try again.',
        ]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Second<span className="text-primary">Ride</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {!user?.profile_complete
                ? 'Complete your profile to get started'
                : 'View or update your profile details'}
            </p>
          </div>

          {/* <button
            type="button"
            onClick={logout}
            className="text-sm font-semibold text-muted-foreground hover:text-primary border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Logout
          </button> */}
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-emerald-800 font-medium shadow-sm">
            <CheckCircle className="text-emerald-600 shrink-0" size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Non-Field Errors Banner */}
        {nonFieldErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 space-y-1.5 shadow-sm">
            {nonFieldErrors.map((msg, i) => (
              <p
                key={i}
                className="text-sm font-semibold text-red-800 leading-relaxed"
              >
                {msg}
              </p>
            ))}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-7 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Profile Fields */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Personal Details
              </h3>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name
                </label>

                <div
                  className={`flex items-center rounded-xl border ${
                    errors.full_name
                      ? 'border-destructive ring-2 ring-destructive/20'
                      : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                  } bg-background transition-all duration-200 overflow-hidden`}
                >
                  <div className="pl-4 pr-1 text-muted-foreground">
                    <User size={18} />
                  </div>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-3 py-3.5 text-foreground text-sm font-medium placeholder:text-muted-foreground placeholder:font-normal focus:outline-none bg-transparent"
                  />
                </div>

                {errors.full_name && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold">
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Country & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Country
                  </label>

                  <div
                    className={`relative rounded-xl border ${
                      errors.country
                        ? 'border-destructive ring-2 ring-destructive/20'
                        : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                    } bg-background transition-all duration-200 overflow-hidden`}
                  >
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="w-full px-4 py-3.5 text-foreground text-sm font-medium focus:outline-none bg-transparent appearance-none cursor-pointer"
                    >
                      <option value="">Select Country</option>
                      {countriesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <MapPin size={16} />
                    </div>
                  </div>

                  {errors.country && (
                    <p className="mt-1.5 text-xs text-red-600 font-semibold">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    State
                  </label>

                  <div
                    className={`relative rounded-xl border ${
                      errors.state
                        ? 'border-destructive ring-2 ring-destructive/20'
                        : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                    } bg-background transition-all duration-200 overflow-hidden`}
                  >
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      disabled={!formData.country}
                      className="w-full px-4 py-3.5 text-foreground text-sm font-medium focus:outline-none bg-transparent appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select State</option>
                      {statesList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <MapPin size={16} />
                    </div>
                  </div>

                  {errors.state && (
                    <p className="mt-1.5 text-xs text-red-600 font-semibold">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* City & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    City
                  </label>

                  <div
                    className={`relative rounded-xl border ${
                      errors.city
                        ? 'border-destructive ring-2 ring-destructive/20'
                        : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                    } bg-background transition-all duration-200 overflow-hidden`}
                  >
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className="w-full px-4 py-3.5 text-foreground text-sm font-medium focus:outline-none bg-transparent appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select City</option>
                      {citiesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <MapPin size={16} />
                    </div>
                  </div>

                  {errors.city && (
                    <p className="mt-1.5 text-xs text-red-600 font-semibold">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Pincode
                  </label>

                  <div
                    className={`flex items-center rounded-xl border ${
                      errors.pincode
                        ? 'border-destructive ring-2 ring-destructive/20'
                        : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                    } bg-background transition-all duration-200 overflow-hidden`}
                  >
                    <div className="pl-4 pr-1 text-muted-foreground">
                      <Hash size={18} />
                    </div>

                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-3 py-3.5 text-foreground text-sm font-medium placeholder:text-muted-foreground placeholder:font-normal focus:outline-none bg-transparent"
                    />
                  </div>

                  {errors.pincode && (
                    <p className="mt-1.5 text-xs text-red-600 font-semibold">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Street Address
                </label>

                <div
                  className={`flex rounded-xl border ${
                    errors.address
                      ? 'border-destructive ring-2 ring-destructive/20'
                      : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                  } bg-background transition-all duration-200 overflow-hidden`}
                >
                  <div className="pl-4 pr-1 pt-3.5 text-muted-foreground self-start">
                    <Home size={18} />
                  </div>

                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Enter your house no, street address, locality..."
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-3.5 text-foreground text-sm font-medium placeholder:text-muted-foreground placeholder:font-normal focus:outline-none bg-transparent resize-none"
                  />
                </div>

                {errors.address && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors order-2 sm:order-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSaving
                    ? 'bg-muted-foreground text-background/80 cursor-not-allowed shadow-sm'
                    : 'bg-foreground hover:bg-foreground/90 text-background active:scale-[0.98] shadow-sm'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 mt-8 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-primary" />
          <span>All data is securely validated and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
