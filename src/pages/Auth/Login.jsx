import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [channel, setChannel] = useState('PHONE'); // PHONE or EMAIL
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setError('Your session has expired. Please log in again.');
      // Clean up the URL query parameters
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const role = user.role || 'USER';
      navigate(`/dashboard/${role.toLowerCase()}`, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 10) {
      setIdentifier(value);
      setError('');
    }
  };

  const handleEmailChange = (e) => {
    setIdentifier(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!identifier.trim()) {
      setError(`Please enter your ${channel === 'PHONE' ? 'mobile number' : 'email address'}`);
      return;
    }

    if (channel === 'PHONE') {
      if (identifier.length !== 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
      if (!/^[6-9]\d{9}$/.test(identifier)) {
        setError('Mobile number must start with 6, 7, 8, or 9');
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await authService.requestOTP(identifier, channel);
      setIsSubmitting(false);
      
      // Success response contains detail, identifier, expires_in_seconds (300)
      navigate('/verify-otp', {
        state: {
          identifier,
          channel,
          expiresInSeconds: response.expires_in_seconds || 300,
        },
      });
    } catch (err) {
      setIsSubmitting(false);
      const detail = err.response?.data?.detail || 'Could not generate OTP right now. Please try again.';
      setError(detail);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">

      {/* Top Bar */}
      <div className="w-full py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-[#57534E] hover:text-[#18181B] font-medium transition-colors text-sm group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-[#18181B] mb-2">
              Second<span className="text-[#b70a10]">Ride</span>
            </h1>
            <p className="text-[#57534E] text-sm">
              Sign in to buy & sell vehicles directly with owners
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-7 sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#18181B] mb-1">
                Welcome back
              </h2>
              <p className="text-sm text-[#57534E]">
                Enter your details to request a secure OTP
              </p>
            </div>

            {/* Toggle Channel tabs */}
            <div className="flex bg-[#F5F5F4] p-1 rounded-xl border border-[#E7E5E4] mb-5">
              <button
                type="button"
                onClick={() => { setChannel('PHONE'); setIdentifier(''); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  channel === 'PHONE'
                    ? 'bg-white text-[#18181B] shadow-sm'
                    : 'text-[#57534E] hover:text-[#18181B]'
                }`}
              >
                Phone Number
              </button>
              <button
                type="button"
                onClick={() => { setChannel('EMAIL'); setIdentifier(''); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  channel === 'EMAIL'
                    ? 'bg-white text-[#18181B] shadow-sm'
                    : 'text-[#57534E] hover:text-[#18181B]'
                }`}
              >
                Email Address
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Identifier Input */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-[#18181B] mb-2">
                  {channel === 'PHONE' ? 'Mobile Number' : 'Email Address'}
                </label>
                
                <div className={`flex items-center rounded-xl border ${
                  error
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-[#E7E5E4] focus-within:border-[#b70a10] focus-within:ring-2 focus-within:ring-[#b70a10]/10'
                } bg-white transition-all duration-200 overflow-hidden`}>
                  
                  {/* Phone prefix only for phone channel */}
                  {channel === 'PHONE' && (
                    <div className="flex items-center gap-1.5 pl-4 pr-3 py-3.5 bg-[#F5F5F4] border-r border-[#E7E5E4] select-none">
                      <span className="text-sm font-semibold text-[#18181B]">+91</span>
                    </div>
                  )}

                  <input
                    id="identifier"
                    type={channel === 'PHONE' ? 'tel' : 'email'}
                    inputMode={channel === 'PHONE' ? 'numeric' : 'email'}
                    autoComplete={channel === 'PHONE' ? 'tel' : 'email'}
                    placeholder={channel === 'PHONE' ? 'Enter 10-digit number' : 'yourname@example.com'}
                    value={identifier}
                    onChange={channel === 'PHONE' ? handlePhoneChange : handleEmailChange}
                    className="flex-1 px-4 py-3.5 text-[#18181B] text-base font-medium placeholder:text-[#A8A29E] placeholder:font-normal focus:outline-none bg-transparent"
                    autoFocus
                  />

                  <div className="pr-4">
                    {channel === 'PHONE' ? (
                      <Phone size={18} className="text-[#A8A29E]" />
                    ) : (
                      <Mail size={18} className="text-[#A8A29E]" />
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm ${
                  isSubmitting
                    ? 'bg-[#57534E] text-white/70 cursor-not-allowed'
                    : 'bg-[#18181B] hover:bg-[#27272A] text-white active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Get OTP
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="text-xs text-[#78716C] text-center mt-5 leading-relaxed">
              By continuing, you agree to our{' '}
              <span className="text-[#b70a10] font-medium cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-[#b70a10] font-medium cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-1.5 text-xs text-[#57534E]">
              <ShieldCheck size={14} className="text-[#b70a10]" />
              <span>Secure Login</span>
            </div>
            <div className="w-1 h-1 bg-[#D6D3D1] rounded-full"></div>
            <div className="flex items-center gap-1.5 text-xs text-[#57534E]">
              <ShieldCheck size={14} className="text-[#b70a10]" />
              <span>No Spam</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
