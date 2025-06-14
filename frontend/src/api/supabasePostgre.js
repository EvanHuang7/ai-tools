import axios from "axios";

export const supabasePostgreRead = async () => {
  const response = await axios.get(`/api/node/users`);
  return response.data;
};

export const supabasePostgreWrite = async ({ name, email }) => {
  return axios.post("/api/node/users", { name, email });
};
