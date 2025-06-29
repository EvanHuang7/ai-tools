import axios from "axios";
import type { PubSubMessage } from "../types/api";

export const gcpPubSubRead = async (): Promise<PubSubMessage[]> => {
  const response = await axios.get<PubSubMessage[]>(
    `/api/node/gcpPubsubMessage`
  );
  return response.data;
};

export const gcpPubSubWrite = async ({ message }: { message: string }) => {
  return axios.post("/api/go/pubsubMessage", { message });
};
