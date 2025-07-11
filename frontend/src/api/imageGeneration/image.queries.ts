import { useMutation, useQuery } from "@tanstack/react-query";
import { generateImage, listImages } from "./image.api";

import type { GenerateImageRequest } from "@/types/api";
import { useAuthedAxios } from "../client";

// TODO: Call them in page file
export const useGenerateImage = () => {
  const axios = useAuthedAxios();
  return useMutation({
    mutationFn: (data: GenerateImageRequest) => generateImage(data, axios),
  });
};

export const useListImages = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["images"],
    queryFn: () => listImages(axios),
  });
};
