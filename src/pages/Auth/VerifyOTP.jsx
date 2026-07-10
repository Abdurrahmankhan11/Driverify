import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, RotateCcw, AlertTriangle } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OTP_LENGTH = 6;

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const identifier = location.state?.identifier;
  const channel = location.state?.channel || 'PHONE';
  const initialExpiresIn = location.state?.expiresInSeconds || 300;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(initialExpiresIn);
  const [canResend, setCanResend] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const inputRefs = useRef([]);

  // Redirect if no identifier in state
  useEffect(() => {
    if (!identifier) {
      navigate('/login', { replace: true });
    }
  }, [identifier, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isLockedOut) return;

    // Only allow single digit
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (isLockedOut) return;

    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (isLockedOut) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setError('');

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((d) => !d);
    const focusIndex = nextEmptyIndex === -1 ? OTP_LENGTH - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    if (!canResend || isResending || isLockedOut) return;

    setIsResending(true);
    setError('');

    try {
      const response = await authService.requestOTP(identifier, channel);
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(response.expires_in_seconds || 300);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to resend OTP. Please try again.';
      setError(detail);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    const otpValue = otp.join('');

    if (otpValue.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await authService.verifyOTP(identifier, channel, otpValue);
      setIsVerifying(false);

      // Success response shape:
      // { is_new_user, access, refresh, user }
      login(response.access, response.refresh, response.user);

      // If user is new OR profile is incomplete, redirect to profile complete page
      if (response.is_new_user || !response.user.profile_complete) {
        navigate('/complete-profile', { replace: true });
      } else {
        const role = response.user.role || 'USER';
        navigate(`/dashboard/${role.toLowerCase()}`, { replace: true });
      }
    } catch (err) {
      setIsVerifying(false);

      const status = err.response?.status;
      const detail = err.response?.data?.detail || 'Verification failed. Please try again.';

      if (status === 429) {
        // Lock out user
        setIsLockedOut(true);
        setError('Maximum verification attempts exceeded. Please request a new OTP.');
      } else if (status === 400 && detail.includes('No OTP requested')) {
        setError(detail);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(detail);
      }
    }
  };

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Masked identifier display
  const maskIdentifier = (id, chan) => {
    if (!id) return '';
    if (chan === 'PHONE') {
      return `+91 ${id.slice(0, 2)}******${id.slice(8)}`;
    } else {
      const parts = id.split('@');
      if (parts.length < 2) return id;
      const [local, domain] = parts;
      if (local.length <= 2) {
        return `${local[0]}*@${domain}`;
      }
      return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
    }
  };

  if (!identifier) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">

      {/* Top Bar */}
      <div className="w-full py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1.5 text-[#57534E] hover:text-[#18181B] font-medium transition-colors text-sm group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
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
              One step away from your account
            </p>
          </div>

          {/* OTP Card */}
          <div className="bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-7 sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#18181B] mb-1">
                Verify OTP
              </h2>
              <p className="text-sm text-[#57534E] leading-relaxed">
                We've sent a 6-digit code to{' '}
                <span className="font-semibold text-[#18181B]">
                  {maskIdentifier(identifier, channel)}
                </span>
              </p>
            </div>

            {isLockedOut && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-red-800">Verification Locked</h4>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    You have entered the wrong OTP 5 times. You must request a fresh OTP to try again.
                  </p>
                  <button
                    onClick={() => {
                      setIsLockedOut(false);
                      setOtp(Array(OTP_LENGTH).fill(''));
                      setError('');
                      navigate('/login');
                    }}
                    className="text-xs font-semibold text-red-800 underline hover:text-red-950 mt-2 block"
                  >
                    Request a new OTP
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* OTP Inputs */}
              <div>
                <label className="block text-sm font-medium text-[#18181B] mb-3">
                  Enter 6-Digit OTP
                </label>
                <div className="flex items-center justify-between gap-2.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      autoFocus={index === 0}
                      disabled={isLockedOut}
                      className={`w-full aspect-square text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none ${error
                          ? 'border-red-400 bg-red-50/50 text-red-600'
                          : digit
                            ? 'border-[#18181B] bg-[#F5F5F4] text-[#18181B]'
                            : 'border-[#E7E5E4] bg-white text-[#18181B] focus:border-[#b70a10] focus:ring-2 focus:ring-[#b70a10]/10'
                        } ${isLockedOut ? 'opacity-50 cursor-not-allowed bg-[#F5F5F4]' : ''}`}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                  </p>
                )}
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#78716C]">
                  Didn't receive the code?
                </span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || isLockedOut}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[#b70a10] hover:text-[#A66548] transition-colors ${isResending || isLockedOut ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <RotateCcw size={14} className={isResending ? 'animate-spin' : ''} />
                    {isResending ? 'Resending...' : 'Resend OTP'}
                  </button>
                ) : (
                  <span className="text-sm font-medium text-[#57534E] tabular-nums">
                    Resend in {formatTimer(timer)}
                  </span>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying || isLockedOut}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm ${isVerifying || isLockedOut
                    ? 'bg-[#57534E] text-white/70 cursor-not-allowed'
                    : 'bg-[#18181B] hover:bg-[#27272A] text-white active:scale-[0.98]'
                  }`}
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>

            {/* Edit Number Link */}
            <div className="text-center mt-5">
              <button
                onClick={() => navigate('/login')}
                disabled={isVerifying}
                className="text-sm text-[#b70a10] font-medium hover:text-[#A66548] hover:underline transition-colors disabled:opacity-50"
              >
                Edit details
              </button>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-1.5 mt-8 text-xs text-[#57534E]">
            <ShieldCheck size={14} className="text-[#b70a10]" />
            <span>Your data is encrypted and secure</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;