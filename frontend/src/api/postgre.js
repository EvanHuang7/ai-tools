import axios from "axios";

export const postgreRead = async () => {
  const response = await axios.get(`/api/node/users`);
  return response.data;
};

export const postgreWrite = async ({ name, email }) => {
  return axios.post("/api/node/users", { name, email });
};
