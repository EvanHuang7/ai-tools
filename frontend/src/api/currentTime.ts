import axios from "axios";
import type { CurrentTimeApiResponse } from "../types/api";

export const fetchCurrentTime = (
  api: string
): Promise<CurrentTimeApiResponse> => {
  return axios.get<CurrentTimeApiResponse>(api).then((res) => res.data);
};
