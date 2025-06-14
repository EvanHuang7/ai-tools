import { useQuery } from "@tanstack/react-query";
import { fetchCurrentTime } from "../api/currentTime";

export const useCurrentTime = (api) => {
  return useQuery({
    queryKey: [api],
    queryFn: () => fetchCurrentTime(api),
  });
};
