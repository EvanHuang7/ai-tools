import type { AxiosInstance } from "axios";
import type { GenerateVideoRequest } from "@/types/api";

// Send multipart/form-data with image + prompt
export const generateVideo = async (
  data: GenerateVideoRequest,
  axios: AxiosInstance
) => {
  const formData = new FormData();
  formData.append("prompt", data.prompt);
  formData.append("image", data.image); // image: File

  const response = await axios.post("/api/go/generate-video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Fetch all generated videos
export const listVideos = async (axios: AxiosInstance) => {
  const response = await axios.get("/api/go/list-videos");
  return response.data;
};
