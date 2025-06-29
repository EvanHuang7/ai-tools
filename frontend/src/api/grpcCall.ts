import axios from "axios";
import type { GrpcResponse } from "../types/api";

export const fetchGrpcCall = async (): Promise<GrpcResponse> => {
  const response = await axios.get<GrpcResponse>(`/api/python/grpc-greet`);
  return response.data;
};
