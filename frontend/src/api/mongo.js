import axios from "axios";

export const mongoRead = async (userId) => {
  const response = await axios.get(`/api/python/plan_read?userId=${userId}`);
  return response.data;
};

export const mongoWrite = async ({ userId, plan }) => {
  return axios.post("/api/python/plan_write", { userId, plan });
};
