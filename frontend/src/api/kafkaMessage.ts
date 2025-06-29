import axios from "axios";
import type { KafkaResponse } from "../types/api";

export const kafkaMessageRead = async (): Promise<KafkaResponse> => {
  const response = await axios.get<KafkaResponse>(
    `/api/python/listKafkaMessages`
  );
  return response.data;
};

export const kafkaMessageWrite = async ({ message }: { message: string }) => {
  return axios.post("/api/node/sendKafkaMessage", { message });
};
