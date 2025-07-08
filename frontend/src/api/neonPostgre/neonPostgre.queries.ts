import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { neonPostgreRead, neonPostgreWrite } from "./neonPostgre.api";
import { useAuthedAxios } from "../client";

export const useNeonPostgreRead = () => {
  const axios = useAuthedAxios();

  return useQuery({
    queryKey: ["neonPostgreRead"],
    queryFn: () => neonPostgreRead(axios),
  });
};

export const useNeonPostgreWrite = () => {
  const queryClient = useQueryClient();
  const axios = useAuthedAxios();

  return useMutation({
    mutationFn: ({ userId, text }: { userId: number; text: string }) =>
      neonPostgreWrite(userId, text, axios),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["neonPostgreRead", userId] });
    },
  });
};
