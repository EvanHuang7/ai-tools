import { api } from "../client";
import type { RedisData } from "@/types/api";

export const redisRead = async (key: string): Promise<RedisData> => {
  const response = await api.get<RedisData>(
    `/api/python/redis_read?key=${key}`
  );
  return response.data;
};

export const redisWrite = async ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  return api.post("/api/python/redis_write", { key, value });
};
