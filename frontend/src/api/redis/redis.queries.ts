import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { redisRead, redisWrite } from "./redis.api";
import { useAuthedAxios } from "../client";

export const useRedisRead = (key: string) => {
  const axios = useAuthedAxios();

  return useQuery({
    queryKey: ["redisRead", key],
    queryFn: () => redisRead(key, axios),
    enabled: !!key, // don't run until key is truthy
  });
};

export const useRedisWrite = () => {
  const queryClient = useQueryClient();
  const axios = useAuthedAxios();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      redisWrite(key, value, axios),

    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ["redisRead", key] });
    },
  });
};
