import axios from "axios";
import type { ApiResponse } from "../types/api";

export const fetchCurrentTime = (api: string): Promise<ApiResponse> => {
  return axios.get<ApiResponse>(api).then((res) => res.data);
};
