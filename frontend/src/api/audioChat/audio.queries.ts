import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { startAudio, createAudio, listAudios } from "./audio.api";

import type { CreateAudioRequest } from "@/types/api";
import { useAuthedAxios } from "../client";

// NOTE: This hook should be mutation instead of query bc
// it is triggered by a button or await.
export const useStartAudio = () => {
  const axios = useAuthedAxios();
  return useMutation({
    mutationFn: () => startAudio(axios),
  });
};

export const useCreateAudio = () => {
  const axios = useAuthedAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAudioRequest) => createAudio(data, axios),
    onSuccess: () => {
      // Invalidate 'audios' and 'appUsage' queries so it refetches fresh data
      queryClient.invalidateQueries({ queryKey: ["audios"] });
      queryClient.invalidateQueries({ queryKey: ["appUsage"] });
    },
  });
};

export const useListAudios = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["audios"],
    queryFn: () => listAudios(axios),
  });
};
