import type { AxiosInstance } from "axios";
import type { GrpcResponse } from "@/types/api";

export const fetchGrpcCall = async (
  axios: AxiosInstance
): Promise<GrpcResponse> => {
  const response = await axios.get<GrpcResponse>(`/api/python/grpc-greet`);
  return response.data;
};
