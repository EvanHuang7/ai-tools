import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kafkaMessageRead, kafkaMessageWrite } from "./kafkaMessage.api";
import { useAuthedAxios } from "../client";

export const useKafkaMessageRead = () => {
  const axios = useAuthedAxios();

  return useQuery({
    queryKey: ["kafkaMessageRead"],
    queryFn: () => kafkaMessageRead(axios),
  });
};

export const useKafkaMessageWrite = () => {
  const queryClient = useQueryClient();
  const axios = useAuthedAxios();

  return useMutation({
    mutationFn: ({ message }: { message: string }) =>
      kafkaMessageWrite(message, axios),

    onSuccess: (_, { message }) => {
      queryClient.invalidateQueries({
        queryKey: ["kafkaMessageRead", message],
      });
    },
  });
};
