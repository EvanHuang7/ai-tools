import { useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import type { GetAppUsageResponse } from "@/types/api";
import { useAuthedAxios } from "@/lib/axiosClient";

export const getAppUsage = async (
  axios: AxiosInstance
): Promise<GetAppUsageResponse> => {
  const response = await axios.get("/api/python/get-app-usage");
  return response.data;
};

// Query hook to get app usage (including remove background image usage)
export const useGetAppUsage = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["appUsage"],
    queryFn: () => getAppUsage(axios),
  });
};
