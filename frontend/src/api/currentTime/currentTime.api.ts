import type { AxiosInstance } from "axios";
import type { CurrentTimeApiResponse } from "@/types/api";

export const fetchCurrentTime = (
  apiName: string,
  axios: AxiosInstance
): Promise<CurrentTimeApiResponse> => {
  return axios.get<CurrentTimeApiResponse>(apiName).then((res) => res.data);
};
