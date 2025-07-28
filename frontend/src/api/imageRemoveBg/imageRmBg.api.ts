import type { AxiosInstance } from "axios";
import type {
  CreateRemovedBgImageRequest,
  CreateRemovedBgImageResponse,
  ListRemovedBgImagesResponse,
} from "@/types/api";

export const createRemovedBgImage = async (
  data: CreateRemovedBgImageRequest,
  axios: AxiosInstance
): Promise<CreateRemovedBgImageResponse> => {
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
