import type { AxiosInstance } from "axios";
import type {
  RemoveBgRequest,
  RemoveBgResponse,
  ListRemovedBgImagesResponse,
  GetAppUsageResponse,
} from "@/types/api";

export const removeBackground = async (
  data: RemoveBgRequest,
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
): Promise<ListRemovedBgImagesResponse> => {
  const response = await axios.get("/api/python/list-removed-bg-images");
  return response.data;
};

export const getAppUsage = async (
  axios: AxiosInstance
): Promise<GetAppUsageResponse> => {
  const response = await axios.get("/api/python/get-app-usage");
  return response.data;
};
