import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateRemovedBgImageRequest } from "@/types/api";

import { createRemovedBgImage, listRemovedBgImages } from "./imageRmBg.api";
import { useAuthedAxios } from "../axiosClient";

// Mutation hook to remove background from an image
export const useCreateRemovedBgImage = () => {
  const axios = useAuthedAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRemovedBgImageRequest) =>
      createRemovedBgImage(data, axios),
    onSuccess: () => {
      // Invalidate 'removedBgImages' and 'appUsage' queries so it refetches fresh data
      queryClient.invalidateQueries({ queryKey: ["removedBgImages"] });
      queryClient.invalidateQueries({ queryKey: ["appUsage"] });
    },
  });
};

// Query hook to list all background removed images
export const useListRemovedBgImages = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["removedBgImages"],
    queryFn: () => listRemovedBgImages(axios),
  });
};
