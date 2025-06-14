import axios from "axios";

export const redisRead = async (key) => {
  const response = await axios.get(`/api/python/redis_read?key=${key}`);
  return response.data;
};

export const redisWrite = async ({ key, value }) => {
  return axios.post("/api/python/redis_write", { key, value });
};
