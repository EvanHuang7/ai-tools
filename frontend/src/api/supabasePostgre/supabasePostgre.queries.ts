import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  supabasePostgreRead,
  supabasePostgreWrite,
} from "./supabasePostgre.api";

export const useSupabasePostgreRead = () => {
  return useQuery({
    queryKey: ["supabasePostgreRead"],
    queryFn: () => supabasePostgreRead(),
  });
};

export const useSupabasePostgreWrite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supabasePostgreWrite,
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries({
        queryKey: ["supabasePostgreRead", name],
      });
    },
  });
};
