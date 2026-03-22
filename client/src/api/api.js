import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add JWT token to all requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors - specifically for unauthorized access
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      console.warn("Unauthorized: Token may be invalid or expired");

      // Clear stored credentials
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login (will be handled by ProtectedRoute on next navigation)
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
