import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService, paymentService } from '../services/api';
import { Loader2, ArrowLeft, MapPin, Fuel, Gauge, Settings2, Calendar, Phone, CheckCircle, Car, ChevronLeft, ChevronRight, Lock, Unlock, AlertCircle, Briefcase } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Payment State
  const [contactState, setContactState] = useState('LOCKED'); // LOCKED, PAYING, VERIFYING, UNLOCKED, FAILED
  const [paymentOrder, setPaymentOrder] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getListing(id);

        if (localStorage.getItem('accessToken')) {
          try {
            const contactData = await paymentService.getContact(id);
            data.seller_phone = contactData.phone;
            data.seller_name = contactData.seller_name;
            setContactState('UNLOCKED');
          } catch (err) {
            // Expected 402 if not paid
            if (data.seller_phone) {
              setContactState('UNLOCKED');
            } else {
              setContactState('LOCKED');
            }
          }
        } else if (data.seller_phone) {
          setContactState('UNLOCKED');
        }

        setVehicle(data);
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
        setError('Failed to load vehicle details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const fetchContact = async () => {
    try {
      setContactState('VERIFYING');
      const contactData = await paymentService.getContact(id);
      setVehicle(prev => ({
        ...prev,
        seller_phone: contactData.phone,
        seller_name: contactData.seller_name || prev.seller_name
      }));
      setContactState('UNLOCKED');
    } catch (err) {
      console.error('Error fetching contact:', err);
      // If it fails because of 402, it stays locked. Otherwise maybe show error.
      setContactState('LOCKED');
    }
  };

  const handleRevealContact = async () => {
    try {
      setContactState('PAYING');
      const orderData = await paymentService.createOrder(id, 'CONTACT_REVEAL');

      if (orderData.already_paid) {
        fetchContact();
      } else {
        setPaymentOrder(orderData);
        openRazorpay(orderData);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      if (err.response?.status === 403) {
        alert(err.response.data.detail || 'Please complete your profile before proceeding.');
        setContactState('LOCKED');
      } else {
        setContactState('FAILED');
      }
    }
  };

  const openRazorpay = async (order) => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setContactState('FAILED');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TGrPHY1I2Bmd6Q',
      amount: parseFloat(order.amount) * 100, // amount in paisa
      currency: order.currency || "INR",
      name: "Second Ride",
      description: "Contact Reveal Payment",
      order_id: order.order_id,
      handler: function (response) {
        handlePaymentSuccess(response, order);
      },
      theme: {
        color: "#0f172a", // Match your brand primary color
      },
      modal: {
        ondismiss: function () {
          handlePaymentCancel(order.order_id);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      setContactState('FAILED');
    });
    paymentObject.open();
  };

  const handlePaymentSuccess = async (paymentData, order) => {
    setContactState('VERIFYING');
    try {
      const res = await paymentService.verifyPayment(
        order.order_id,
        paymentData.razorpay_payment_id,
        paymentData.razorpay_signature
      );

      if (res.payment_status === 'SUCCESS') {
        fetchContact();
      } else {
        setContactState('FAILED');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      setContactState('FAILED');
    }
  };

  const handlePaymentCancel = async (orderId) => {
    setContactState('LOCKED');
    if (orderId) {
      try {
        await paymentService.cancelOrder(orderId);
      } catch (err) {
        console.error('Error cancelling order:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center px-4 min-h-[60vh]">
        <p className="text-xl text-muted-foreground mb-4">{error || 'Vehicle not found.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    );
  }

  const formatPrice = (price) => {
    const val = parseFloat(price);
    if (isNaN(val)) return `₹${price}`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const images = vehicle.images?.length > 0
    ? vehicle.images
    : [{ image_url: 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image' }];

  return (
    <div className="flex-1 w-full animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-muted border border-border relative">
              <img
                src={images[activeImage].image_url}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-foreground shadow-sm uppercase tracking-wider flex items-center gap-2 border border-border/50">
                <Car size={16} /> {vehicle.vehicle_type || 'Car'}
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img.image_url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col h-full">
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {vehicle.brand} {vehicle.model} <span className="text-muted-foreground font-medium text-lg">{vehicle.variant}</span>
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={14} /> {vehicle.location}
                </p>
              </div>

              <div className="text-2xl font-bold text-primary mb-4 pb-4 border-b border-border">
                {formatPrice(vehicle.price)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Year</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.year}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Gauge size={12} /> Driven</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.kilometers_driven ? `${vehicle.kilometers_driven.toLocaleString('en-IN')} km` : 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Fuel size={12} /> Fuel</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.fuel_type}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Settings2 size={12} /> Trans.</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.transmission}</span>
                </div>
              </div>

              <button
                className="w-full bg-primary hover:bg-primary/90 text-background py-3 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Briefcase size={16} />  Hire a Middleman
              </button>

              <div className="mb-4 pt-2">
                <h3 className="text-sm font-bold text-foreground mb-2 pb-2 border-b border-border">Vehicle Highlights</h3>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-start justify-between">
                    <span className="text-muted-foreground">Ownership</span>
                    <span className="font-semibold text-foreground">{vehicle.ownership}</span>
                  </li>
                  <li className="flex items-start justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <CheckCircle size={14} className="text-green-500" /> {vehicle.status}
                    </span>
                  </li>
                  {(contactState === 'UNLOCKED' || vehicle.seller_phone) && (
                    <div>
                      <li className="flex items-start justify-between ">
                        <span className="text-muted-foreground">Seller Name</span>
                        <span className="font-semibold text-foreground">{vehicle.seller_name || 'Not Provided'}</span>
                      </li>
                      <li className="flex items-start justify-between pt-1">
                        <span className="text-muted-foreground">Seller Phone</span>
                        <span className="font-semibold text-foreground">{vehicle.seller_phone || 'Not Provided'}</span>
                      </li>
                    </div>
                  )}
                </ul>
              </div>

              {vehicle.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-foreground mb-2 pb-2 border-b border-border">Description</h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-xs">
                    {vehicle.description}
                  </p>
                </div>
              )}
              <div className="mt-auto pt-4 border-t border-border">
                {contactState === 'UNLOCKED' || vehicle.seller_phone ? (
                  <div className="flex gap-2">
                    <a
                      href={`tel:${vehicle.seller_phone}`}
                      className="flex-1 group bg-white border border-slate-300  hover:bg-blue-50 text-slate-800 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                        <Phone
                          size={18}
                          className="text-blue-600 group-hover:text-white transition-colors"
                        />
                      </div>

                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/91${vehicle.seller_phone?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 group bg-[#25D366] hover:bg-[#1EBE5B] text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                        <FaWhatsapp size={20} />
                      </div>

                      <span>WhatsApp</span>
                    </a>
                  </div>
                ) : contactState === 'FAILED' ? (
                  <div className="space-y-2">
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 text-center flex items-center justify-center gap-2">
                      <AlertCircle size={16} /> Payment failed
                    </div>
                    <button onClick={handleRevealContact} className="w-full bg-foreground hover:bg-foreground/90 text-background py-3 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-base">
                      Retry Payment
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRevealContact}
                    disabled={contactState === 'PAYING' || contactState === 'VERIFYING'}
                    className="w-full bg-foreground hover:bg-foreground/90 text-background py-3 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {contactState === 'PAYING' || contactState === 'VERIFYING' ? (
                      <><Loader2 size={18} className="animate-spin" /> {contactState === 'PAYING' ? 'Processing...' : 'Verifying...'}</>
                    ) : (
                      <><Lock size={18} /> Reveal Contact</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
