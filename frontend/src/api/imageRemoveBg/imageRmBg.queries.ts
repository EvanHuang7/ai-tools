import { useMutation, useQuery } from "@tanstack/react-query";
import { RemoveBgRequest } from "@/types/api";

import {
  removeBackground,
  listRemovedBgImages,
  getAppUsage,
} from "./imageRmBg.api";
import { useAuthedAxios } from "../client";

// Mutation hook to remove background from an image
export const useRemoveBackground = () => {
  const axios = useAuthedAxios();
  return useMutation({
    mutationFn: (data: RemoveBgRequest) => removeBackground(data, axios),
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

// TODO: move to index.ts
// Query hook to get app usage (including remove background image usage)
export const useGetAppUsage = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["appUsage"],
    queryFn: () => getAppUsage(axios),
  });
};
