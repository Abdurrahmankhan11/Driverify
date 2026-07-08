import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vx1wlxgw-8000.inc1.devtunnels.ms/',
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
          'https://vx1wlxgw-8000.inc1.devtunnels.ms/auth/token/refresh/',
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

export default api;
