import { useQuery } from "@tanstack/react-query";
import { fetchCurrentTime } from "./currentTime.api";
import { useAuthedAxios } from "../client";

export const useCurrentTime = (api: string) => {
  const apiName = api;
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: [api],
    queryFn: () => fetchCurrentTime(apiName, axios),
  });
};
