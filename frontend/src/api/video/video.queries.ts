import { useMutation } from "@tanstack/react-query";
import { generateVideo } from "./video.api";
import type { GenerateVideoRequest } from "@/types/api";
import { useAuthedAxios } from "../client";

export const useGenerateVideo = () => {
  const axios = useAuthedAxios();

  return useMutation({
    mutationFn: (data: GenerateVideoRequest) => generateVideo(data, axios),
  });
};
