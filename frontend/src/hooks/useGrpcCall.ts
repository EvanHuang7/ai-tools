import { useQuery } from "@tanstack/react-query";
import { fetchGrpcCall } from "../api/grpcCall";

export const useGrpcCall = () => {
  return useQuery({
    queryKey: ["grpcCall"],
    queryFn: () => fetchGrpcCall(),
  });
};
