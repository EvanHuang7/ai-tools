import { api } from "../client";
import type { Message } from "@/types/api";

export const neonPostgreRead = async (): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/api/go/messages`);
  return response.data;
};

export const neonPostgreWrite = async ({
  userId,
  text,
}: {
  userId: number;
  text: string;
}) => {
  return api.post("/api/go/messages", { userId, text });
};
