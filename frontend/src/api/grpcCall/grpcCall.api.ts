import { api } from "../client";
import type { GrpcResponse } from "@/types/api";

export const fetchGrpcCall = async (): Promise<GrpcResponse> => {
  const response = await api.get<GrpcResponse>(`/api/python/grpc-greet`);
  return response.data;
};
