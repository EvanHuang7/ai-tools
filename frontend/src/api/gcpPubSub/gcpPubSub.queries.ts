import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gcpPubSubRead, gcpPubSubWrite } from "./gcpPubSub.api";

export const useGcpPubSubRead = () => {
  return useQuery({
    queryKey: ["gcpPubSubRead"],
    queryFn: () => gcpPubSubRead(),
  });
};

export const useGcpPubSubWrite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gcpPubSubWrite,
    onSuccess: (_, { message }) => {
      queryClient.invalidateQueries({ queryKey: ["gcpPubSubRead", message] });
    },
  });
};
