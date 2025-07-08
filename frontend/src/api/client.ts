import axios from "axios";

export const api = axios.create({
  // It will use the current web page host to make the api calls if
  // not specifying the api base url
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk using the proper method
    try {
      const token = await (window as any).Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to get auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
