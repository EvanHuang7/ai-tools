import type { AxiosInstance } from "axios";
import type { GenerateVideoRequest } from "@/types/api";

export const generateVideo = (
  data: GenerateVideoRequest,
  axios: AxiosInstance
) => axios.post("/video/generate", data);
