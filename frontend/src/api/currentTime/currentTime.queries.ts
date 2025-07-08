import { useQuery } from "@tanstack/react-query";
import { fetchCurrentTime } from "./currentTime.api";

export const useCurrentTime = (api: string) => {
  const apiName = api;
  return useQuery({
    queryKey: [api],
    queryFn: () => fetchCurrentTime(apiName),
  });
};
