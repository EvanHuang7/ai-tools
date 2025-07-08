import type { AxiosInstance } from "axios";
import type { KafkaResponse } from "@/types/api";

export const kafkaMessageRead = async (
  axios: AxiosInstance
): Promise<KafkaResponse> => {
  const response = await axios.get<KafkaResponse>(
    `/api/python/listKafkaMessages`
  );
  return response.data;
};

export const kafkaMessageWrite = async (
  message: string,
  axios: AxiosInstance
) => {
  return axios.post("/api/node/sendKafkaMessage", { message });
};
