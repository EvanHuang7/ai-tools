import axios from "axios";

export const neonPostgreRead = async () => {
  const response = await axios.get(`/api/go/messages`);
  return response.data;
};

export const neonPostgreWrite = async ({ userId, text }) => {
  return axios.post("/api/go/messages", { userId, text });
};
