import { useMutation } from "@tanstack/react-query";
import { generateVideo, listVideo } from "./video.api";
import type { GenerateVideoRequest } from "@/types/api";

export const useGenerateVideo = () =>
  useMutation({
    mutationFn: (data: GenerateVideoRequest) => generateVideo(data),
  });

export const useListVideo = () =>
  useMutation({
    mutationFn: (data: GenerateVideoRequest) => listVideo(data),
  });
