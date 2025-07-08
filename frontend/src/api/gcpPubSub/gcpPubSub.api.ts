import type { AxiosInstance } from "axios";
import type { PubSubMessage } from "@/types/api";

export const gcpPubSubRead = async (
  axios: AxiosInstance
): Promise<PubSubMessage[]> => {
  const response = await axios.get<PubSubMessage[]>(
    `/api/node/gcpPubsubMessage`
  );
  return response.data;
};

export const gcpPubSubWrite = async (message: string, axios: AxiosInstance) => {
  return axios.post("/api/go/pubsubMessage", { message });
};
