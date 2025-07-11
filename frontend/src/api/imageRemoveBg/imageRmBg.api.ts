import type { AxiosInstance } from "axios";
import type { RemoveBgResponse } from "@/types/api";

export const removeBackground = async (
  data: { image: File },
  axios: AxiosInstance
): Promise<RemoveBgResponse> => {
  const formData = new FormData();
  formData.append("image", data.image);

  const response = await axios.post("/api/python/remove-bg", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const listRemovedBgImages = async (
  axios: AxiosInstance
): Promise<RemoveBgResponse["image"][]> => {
  const response = await axios.get("/api/python/list-removed-bg-images");
  return response.data.images;
};

export const getAppUsage = async (axios: AxiosInstance) => {
  const response = await axios.get("/api/python/get-app-usage");
  return response.data;
};
