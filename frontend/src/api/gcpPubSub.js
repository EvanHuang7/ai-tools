import axios from "axios";

export const gcpPubSubRead = async () => {
  const response = await axios.get(`/api/node/gcpPubsubMessage`);
  return response.data;
};

export const gcpPubSubWrite = async ({ message }) => {
  return axios.post("/api/go/pubsubMessage", { message });
};
