import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mongoRead, mongoWrite } from "./mongo.api";
import { useAuthedAxios } from "../client";

export const useMongoRead = (userId: string) => {
  const axios = useAuthedAxios();

  return useQuery({
    queryKey: ["mongoRead", userId],
    queryFn: () => mongoRead(userId, axios),
    enabled: !!userId, // don't run until userId is truthy
  });
};

export const useMongoWrite = () => {
  const queryClient = useQueryClient();
  const axios = useAuthedAxios();

  return useMutation({
    mutationFn: ({ userId, plan }: { userId: string; plan: string }) =>
      mongoWrite(userId, plan, axios),

    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["mongoRead", userId] });
    },
  });
};
