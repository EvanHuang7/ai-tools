import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kafkaMessageRead, kafkaMessageWrite } from "../api/kafkaMessage";

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
      queryClient.invalidateQueries(["kafkaMessageRead", message]);
    },
  });
};
