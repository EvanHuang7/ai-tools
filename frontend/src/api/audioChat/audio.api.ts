import type { AxiosInstance } from "axios";
import type { CreateAudioRequest } from "@/types/api";

export const startAudio = async (axios: AxiosInstance) => {
  const response = await axios.get("/api/node/audio/start");
  return response.data;
};

export const createAudio = async (
  data: CreateAudioRequest,
  axios: AxiosInstance
) => {
  const response = await axios.post("/api/node/audio/create", data);
  return response.data;
};

export const listAudios = async (axios: AxiosInstance) => {
  const response = await axios.get("/api/node/audio/list");
  return response.data;
};
