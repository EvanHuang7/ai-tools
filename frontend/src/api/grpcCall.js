import axios from "axios";

export const fetchGrpcCall = async () => {
  const response = await axios.get(`/api/python/grpc-greet`);
  return response.data;
};
