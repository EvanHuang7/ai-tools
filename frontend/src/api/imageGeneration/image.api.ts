import type { AxiosInstance } from "axios";
import type { GenerateImageRequest } from "@/types/api";

export const generateImage = async (
  data: GenerateImageRequest,
  axios: AxiosInstance
) => {
  const response = await axios.post("/api/go/generate-image", data);
  return response.data;
};

export const listImages = async (axios: AxiosInstance) => {
  const response = await axios.get("/api/go/list-images");
  return response.data;
};
