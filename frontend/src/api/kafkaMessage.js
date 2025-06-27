import axios from "axios";

export const kafkaMessageRead = async () => {
  const response = await axios.get(`/api/python/listKafkaMessages`);
  return response.data;
};

export const kafkaMessageWrite = async ({ message }) => {
  return axios.post("/api/node/sendKafkaMessage", { message });
};
