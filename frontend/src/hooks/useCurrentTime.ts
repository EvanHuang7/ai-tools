import { useQuery } from "@tanstack/react-query";
import { fetchCurrentTime } from "../api/currentTime";

export const useCurrentTime = (api: string) => {
  return useQuery({
    queryKey: [api],
    queryFn: () => fetchCurrentTime(api),
  });
};
