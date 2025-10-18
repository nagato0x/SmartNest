import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie"; // Still useful for clearing state, but not for sending the token

// Define base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback URLs
  if (window.location.hostname === "mern-booking-hotel.netlify.app") {
    return "https://mern-hotel-booking-68ej.onrender.com";
  }

  if (window.location.hostname === "localhost") {
    return "http://localhost:7002";
  }

  // Default to production
  return "https://mern-hotel-booking-68ej.onrender.com";
};

// Extend axios config to include metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: { retryCount: number };
}

// Create axios instance with consistent configuration
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This is CORRECT and ESSENTIAL for sending cookies
  timeout: 30000, // 30 second timeout
});

// Request interceptor: REMOVE Authorization header logic
// When withCredentials: true is set, the browser automatically attaches the cookie (auth_token).
axiosInstance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  
  // NOTE: JWT Token logic via header is removed here to rely on cookies.
  
  // Add retry count to track retries
  config.metadata = { retryCount: 0 };

  return config;
});

// Response interceptor to handle common errors and retries
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // Handle 401 errors by clearing session
    if (error.response?.status === 401) {
      // CRITICAL CHANGE: Only clear the cookie and remove the local storage session_id
      // but the main authentication state should rely on the absence of the valid cookie.
      Cookies.remove("auth_token"); // Clear the cookie the backend sets
      localStorage.removeItem("session_id"); // Clear the legacy item
      // Don't redirect automatically - let components handle it
    }

    // ... (Retry logic for 429 and network errors remains the same)

    if (error.response?.status === 429 && config) {
        const customConfig = config as CustomAxiosRequestConfig;
        if (customConfig.metadata && customConfig.metadata.retryCount < 3) {
            customConfig.metadata.retryCount += 1;
            const delay = Math.pow(2, customConfig.metadata.retryCount - 1) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
            return axiosInstance(config);
        }
    }

    if (!error.response && config) {
        const customConfig = config as CustomAxiosRequestConfig;
        if (customConfig.metadata && customConfig.metadata.retryCount < 2) {
            customConfig.metadata.retryCount += 1;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return axiosInstance(config);
        }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
