import { api } from "../client";
import type { PubSubMessage } from "@/types/api";

export const gcpPubSubRead = async (): Promise<PubSubMessage[]> => {
  const response = await api.get<PubSubMessage[]>(`/api/node/gcpPubsubMessage`);
  return response.data;
};

export const gcpPubSubWrite = async ({ message }: { message: string }) => {
  return api.post("/api/go/pubsubMessage", { message });
};
