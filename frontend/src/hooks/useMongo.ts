import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mongoRead, mongoWrite } from "../api/mongo";

export const useMongoRead = (userId: string) => {
  return useQuery({
    queryKey: ["mongoRead", userId],
    queryFn: () => mongoRead(userId),
    enabled: !!userId, // don't run until userId is truthy
  });
};

export const useMongoWrite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mongoWrite,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["mongoRead", userId] });
    },
  });
};
