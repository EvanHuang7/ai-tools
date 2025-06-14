import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { neonPostgreRead, neonPostgreWrite } from "../api/neonPostgre";

export const useNeonPostgreRead = () => {
  return useQuery({
    queryKey: ["neonPostgreRead"],
    queryFn: () => neonPostgreRead(),
  });
};

export const useNeonPostgreWrite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: neonPostgreWrite,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["neonPostgreRead", userId]);
    },
  });
};
