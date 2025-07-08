import { api } from "../client";
import type { GenerateVideoRequest } from "@/types/api";

export const generateVideo = (data: GenerateVideoRequest) =>
  api.post("/video/generate", data);

export const listVideo = (data: GenerateVideoRequest) =>
  api.post("/video/list", data);
