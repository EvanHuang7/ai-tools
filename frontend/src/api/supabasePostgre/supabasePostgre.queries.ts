import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  supabasePostgreRead,
  supabasePostgreWrite,
} from "./supabasePostgre.api";
import { useAuthedAxios } from "../client";

export const useSupabasePostgreRead = () => {
  const axios = useAuthedAxios();

  return useQuery({
    queryKey: ["supabasePostgreRead"],
    queryFn: () => supabasePostgreRead(axios),
  });
};

export const useSupabasePostgreWrite = () => {
  const queryClient = useQueryClient();
  const axios = useAuthedAxios();

  return useMutation({
    mutationFn: ({ name, email }: { name: string; email: string }) =>
      supabasePostgreWrite(name, email, axios),

    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries({
        queryKey: ["supabasePostgreRead", name],
      });
    },
  });
};
