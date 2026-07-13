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
    <div className="min-h-screen bg-background flex flex-col">

      {/* Top Bar */}
      <div className="w-full py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1"
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Second<span className="text-primary">Ride</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to buy & sell vehicles directly with owners
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-7 sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-1">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your details to request a secure OTP
              </p>
            </div>

            {/* Toggle Channel tabs */}
            <div className="flex bg-muted p-1 rounded-xl border border-border mb-5">
              <button
                type="button"
                onClick={() => { setChannel('PHONE'); setIdentifier(''); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  channel === 'PHONE'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Phone Number
              </button>
              <button
                type="button"
                onClick={() => { setChannel('EMAIL'); setIdentifier(''); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  channel === 'EMAIL'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Email Address
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Identifier Input */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-foreground mb-2">
                  {channel === 'PHONE' ? 'Mobile Number' : 'Email Address'}
                </label>
                
                <div className={`flex items-center rounded-xl border ${
                  error
                    ? 'border-destructive ring-2 ring-destructive/20'
                    : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                } bg-background transition-all duration-200 overflow-hidden`}>
                  
                  {/* Phone prefix only for phone channel */}
                  {channel === 'PHONE' && (
                    <div className="flex items-center gap-1.5 pl-4 pr-3 py-3.5 bg-muted border-r border-border select-none">
                      <span className="text-sm font-semibold text-foreground">+91</span>
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
                    className="flex-1 px-4 py-3.5 text-foreground text-base font-medium placeholder:text-muted-foreground placeholder:font-normal focus:outline-none bg-transparent"
                    autoFocus
                  />

                  <div className="pr-4">
                    {channel === 'PHONE' ? (
                      <Phone size={18} className="text-muted-foreground" />
                    ) : (
                      <Mail size={18} className="text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSubmitting
                    ? 'bg-muted-foreground text-background/70 cursor-not-allowed'
                    : 'bg-foreground hover:bg-foreground/90 text-background active:scale-[0.98]'
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
            <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
              By continuing, you agree to our{' '}
              <span className="text-primary font-medium cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm" tabIndex={0}>Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary font-medium cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm" tabIndex={0}>Privacy Policy</span>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              <span>Secure Login</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full"></div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              <span>No Spam</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
