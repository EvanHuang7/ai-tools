import axios from "axios";
import type {
  User,
  ProcessImageRequest,
  GenerateVideoRequest,
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
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
  (error) => {
    return Promise.reject(error);
  }
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

// API functions
export const videoApi = {
  generateVideo: (data: GenerateVideoRequest) =>
    api.post("/video/generate", data),
};

export const chatApi = {
  sendMessage: (message: string) => api.post("/chat/message", { message }),
  sendAudioMessage: (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    return api.post("/chat/audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
