import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { redisRead, redisWrite } from "../api/redis";

export const useRedisRead = (key: string) => {
  return useQuery({
    queryKey: ["redisRead", key],
    queryFn: () => redisRead(key),
    enabled: !!key, // don't run until key is truthy
  });
};

export const useRedisWrite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: redisWrite,
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ["redisRead", key] });
    },
  });
};
