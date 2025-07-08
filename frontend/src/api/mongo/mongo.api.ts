import type { AxiosInstance } from "axios";
import type { MongoResponse } from "@/types/api";

export const mongoRead = async (
  userId: string,
  axios: AxiosInstance
): Promise<MongoResponse> => {
  const response = await axios.get<MongoResponse>(
    `/api/python/plan_read?userId=${userId}`
  );
  return response.data;
};

export const mongoWrite = async (
  userId: string,
  plan: string,
  axios: AxiosInstance
) => {
  return axios.post("/api/python/plan_write", { userId, plan });
};
