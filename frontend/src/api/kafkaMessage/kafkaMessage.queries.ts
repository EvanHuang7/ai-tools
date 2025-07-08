import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kafkaMessageRead, kafkaMessageWrite } from "./kafkaMessage.api";

export const useKafkaMessageRead = () => {
  return useQuery({
    queryKey: ["kafkaMessageRead"],
    queryFn: () => kafkaMessageRead(),
  });
};

export const useKafkaMessageWrite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kafkaMessageWrite,
    onSuccess: (_, { message }) => {
      queryClient.invalidateQueries({
        queryKey: ["kafkaMessageRead", message],
      });
    },
  });
};
