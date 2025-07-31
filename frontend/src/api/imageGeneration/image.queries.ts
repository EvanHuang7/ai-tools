import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { generateImage, listImages } from "./image.api";

import type { GenerateImageRequest } from "@/types/api";
import { useAuthedAxios } from "@/lib/axiosClient";

export const useGenerateImage = () => {
  const axios = useAuthedAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateImageRequest) => generateImage(data, axios),
    onSuccess: () => {
      // Invalidate 'images' and 'appUsage' queries so it refetches fresh data
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["appUsage"] });
    },
  });
};

export const useListImages = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["images"],
    queryFn: () => listImages(axios),
  });
};
