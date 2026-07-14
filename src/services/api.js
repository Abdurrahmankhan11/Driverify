import axios from 'axios';
import { constants } from '../constants/constants';

const isDev = import.meta.env.DEV;

const api = axios.create({
  baseURL: isDev ? '/api' : constants.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-Tunnel-Skip-Anti-Spam-Page': 'true',
  },
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auto token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and the request hasn't been retried yet
    // Also prevent looping if the refresh endpoint itself returns 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes('/auth/token/refresh/')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token stored');
        }

        // Call the refresh token endpoint using raw axios to avoid interceptor issues
        const response = await axios.post(
          isDev ? '/api/auth/token/refresh/' : `${constants.baseUrl}/auth/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Tunnel-Skip-Anti-Spam-Page': 'true',
            },
          }
        );

        const { access, refresh: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update Authorization header on original request and retry
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired or invalid, log out the user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login?expired=true';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  requestOTP: async (identifier, channel) => {
    const res = await api.post('/auth/otp/request/', { identifier, channel });
    return res.data;
  },
  verifyOTP: async (identifier, channel, otpCode) => {
    const res = await api.post('/auth/otp/verify/', { identifier, channel, otp_code: otpCode });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/profile/');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.patch('/auth/profile/', data);
    return res.data;
  },
  getCountries: async () => {
    const res = await api.get('/mp/countries/');
    return res.data.data;
  },

  getStates: async (countryName) => {
    const res = await api.get('/mp/states/', {
      params: { country: countryName },
    });
    return res.data.data;
  },

  getCities: async (countryName, stateName) => {
    const res = await api.get('/mp/cities/', {
      params: {
        country: countryName,
        state: stateName,
      },
    });
    return res.data.data;
  },
};

export const vehicleService = {
  // Metadata endpoints
  getCountries: async () => {
    const res = await api.get('/mp/countries/');
    return res.data.data;
  },
  getStates: async (countryIdOrName) => {
    const res = await api.get('/mp/states/', { params: { country: countryIdOrName } });
    return res.data.data;
  },
  getCities: async (countryId, stateId) => {
    const res = await api.get('/mp/cities/', { params: { country: countryId, state: stateId } });
    return res.data.data;
  },
  getVehicleTypes: async () => {
    const res = await api.get('/mp/vehicle-types');
    return res.data.data;
  },
  getBrands: async () => {
    const res = await api.get('/mp/brands');
    return res.data.data;
  },
  getModels: async (brandId) => {
    const res = await api.get('/mp/models', { params: { brand_id: brandId } });
    return res.data.data;
  },
  getVariants: async (modelId) => {
    const res = await api.get('/mp/variants', { params: { model_id: modelId } });
    return res.data.data;
  },
  getFuelTypes: async () => {
    const res = await api.get('/mp/fuel-types');
    return res.data.data;
  },
  getTransmissionTypes: async () => {
    const res = await api.get('/mp/transmission-types');
    return res.data.data;
  },
  getOwnershipTypes: async () => {
    const res = await api.get('/mp/ownership-types');
    return res.data.data;
  },
  getDocumentTypes: async () => {
    const res = await api.get('/mp/document-types');
    return res.data.data;
  },
  getServiceHistoryTypes: async () => {
    const res = await api.get('/mp/service-history-types');
    return res.data.data;
  },

  // Listing APIs
  createListing: async (data) => {
    const res = await api.post('/mp/listings', data);
    return res.data;
  },
  getListing: async (id) => {
    const res = await api.get(`/mp/listings/${id}`);
    return res.data;
  },
  uploadExteriorImage: async (listingId, formData, onUploadProgress) => {
    const res = await api.post(`/mp/listings/${listingId}/images/exterior`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return res.data;
  },
  uploadInteriorImage: async (listingId, formData, onUploadProgress) => {
    const res = await api.post(`/mp/listings/${listingId}/images/interior`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return res.data;
  },
  uploadServiceHistory: async (listingId, formData, onUploadProgress) => {
    const res = await api.post(`/mp/listings/${listingId}/service-history/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return res.data;
  },
  uploadHistoryDocument: async (listingId, formData, onUploadProgress) => {
    const res = await api.post(`/mp/listings/${listingId}/history-documents/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return res.data;
  },
  getListingsDetails: async () => {
    const res = await api.get('/mp/listings/details');
    return res.data;
  },
};

export default api;
