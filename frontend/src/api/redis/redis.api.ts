import type { AxiosInstance } from "axios";
import type { RedisData } from "@/types/api";

export const redisRead = async (
  key: string,
  axios: AxiosInstance
): Promise<RedisData> => {
  const response = await axios.get<RedisData>(
    `/api/python/redis_read?key=${key}`
  );
  return response.data;
};

export const redisWrite = async (
  key: string,
  value: string,
  axios: AxiosInstance
) => {
  return axios.post("/api/python/redis_write", { key, value });
};
