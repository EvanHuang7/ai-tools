import { useQuery } from "@tanstack/react-query";
import { fetchGrpcCall } from "./grpcCall.api";
import { useAuthedAxios } from "../client";

export const useGrpcCall = () => {
  const axios = useAuthedAxios();
  return useQuery({
    queryKey: ["grpcCall"],
    queryFn: () => fetchGrpcCall(axios),
  });
};
