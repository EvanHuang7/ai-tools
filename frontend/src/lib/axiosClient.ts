import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export const useAuthedAxios = () => {
  const { getToken } = useAuth();

  const instance = axios.create({
    // It will use the current web page host to make the api calls if
    // not specifying the api base url
    timeout: 90000, // The API call timeout time is set to 90s
  });

  instance.interceptors.request.use(async (config: any) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (error) {
      console.warn("Failed to attach Clerk token:", error);
    }
    return config;
  });
  return instance;
};
