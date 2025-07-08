import { api } from "../client";
import type { KafkaResponse } from "@/types/api";

export const kafkaMessageRead = async (): Promise<KafkaResponse> => {
  const response = await api.get<KafkaResponse>(
    `/api/python/listKafkaMessages`
  );
  return response.data;
};

export const kafkaMessageWrite = async ({ message }: { message: string }) => {
  return api.post("/api/node/sendKafkaMessage", { message });
};
