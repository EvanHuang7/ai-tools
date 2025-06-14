import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postgreRead, postgreWrite } from "../api/postgre";

export const usePostgreRead = () => {
  return useQuery({
    queryKey: ["postgreRead"],
    queryFn: () => postgreRead(),
  });
};

export const usePostgreWrite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postgreWrite,
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries(["postgreRead", name]);
    },
  });
};
