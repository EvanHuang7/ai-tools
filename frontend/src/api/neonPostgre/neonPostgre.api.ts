import type { AxiosInstance } from "axios";
import type { Message } from "@/types/api";

export const neonPostgreRead = async (
  axios: AxiosInstance
): Promise<Message[]> => {
  const response = await axios.get<Message[]>(`/api/go/messages`);
  return response.data;
};

export const neonPostgreWrite = async (
  userId: number,
  text: string,
  axios: AxiosInstance
) => {
  return axios.post("/api/go/messages", { userId, text });
};
