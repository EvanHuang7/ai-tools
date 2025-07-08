import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gcpPubSubRead, gcpPubSubWrite } from "./gcpPubSub.api";
import { useAuthedAxios } from "../client";

export const useGcpPubSubRead = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["gcpPubSubRead"],
    queryFn: () => gcpPubSubRead(axios),
  });
};

export const useGcpPubSubWrite = () => {
  const queryClient = useQueryClient();
  const axios = useAuthedAxios();

  return useMutation({
    mutationFn: ({ message }: { message: string }) =>
      gcpPubSubWrite(message, axios),

    onSuccess: (_, { message }) => {
      queryClient.invalidateQueries({ queryKey: ["gcpPubSubRead", message] });
    },
  });
};
