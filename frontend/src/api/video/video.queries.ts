import { useMutation, useQuery } from "@tanstack/react-query";
import { generateVideo, listVideos } from "./video.api";
import type { GenerateVideoRequest } from "@/types/api";
import { useAuthedAxios } from "../client";

// TODO: Call them in page file
// Mutation to generate a video
export const useGenerateVideo = () => {
  const axios = useAuthedAxios();
  return useMutation({
    mutationFn: (data: GenerateVideoRequest) => generateVideo(data, axios),
  });
};

// Query to list all videos for the current user
export const useListVideos = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["videos"],
    queryFn: () => listVideos(axios),
  });
};
