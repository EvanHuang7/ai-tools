import axios from "axios";
import type { MongoResponse } from "../types/api";

export const mongoRead = async (userId: string): Promise<MongoResponse> => {
  const response = await axios.get<MongoResponse>(
    `/api/python/plan_read?userId=${userId}`
  );
  return response.data;
};

export const mongoWrite = async ({
  userId,
  plan,
}: {
  userId: string;
  plan: string;
}) => {
  return axios.post("/api/python/plan_write", { userId, plan });
};
