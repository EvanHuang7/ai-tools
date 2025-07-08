import { useQuery } from "@tanstack/react-query";
import { fetchGrpcCall } from "./grpcCall.api";

export const useGrpcCall = () => {
  return useQuery({
    queryKey: ["grpcCall"],
    queryFn: () => fetchGrpcCall(),
  });
};
