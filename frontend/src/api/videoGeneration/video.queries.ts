import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { generateVideo, listVideos } from "./video.api";
import type { GenerateVideoRequest } from "@/types/api";
import { useAuthedAxios } from "../client";

// Mutation to generate a video
export const useGenerateVideo = () => {
  const axios = useAuthedAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateVideoRequest) => generateVideo(data, axios),
    onSuccess: () => {
      // Invalidate 'videos' and 'appUsage' queries so it refetches fresh data
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["appUsage"] });
    },
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
