import axios from "axios";
import type { User } from "../types/api";

export const supabasePostgreRead = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`/api/node/users`);
  return response.data;
};

export const supabasePostgreWrite = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  return axios.post("/api/node/users", { name, email });
};
