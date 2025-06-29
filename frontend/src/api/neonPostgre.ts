import axios from "axios";
import type { Message } from "../types/api";

export const neonPostgreRead = async (): Promise<Message[]> => {
  const response = await axios.get<Message[]>(`/api/go/messages`);
  return response.data;
};

export const neonPostgreWrite = async ({
  userId,
  text,
}: {
  userId: number;
  text: string;
}) => {
  return axios.post("/api/go/messages", { userId, text });
};
