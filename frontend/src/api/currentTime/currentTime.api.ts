import { api } from "../client";
import type { CurrentTimeApiResponse } from "@/types/api";

export const fetchCurrentTime = (
  apiName: string
): Promise<CurrentTimeApiResponse> => {
  return api.get<CurrentTimeApiResponse>(apiName).then((res) => res.data);
};
