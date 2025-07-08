import axios from "axios";
import type { SupabaseUser } from "../types/api";

export const supabasePostgreRead = async (): Promise<SupabaseUser[]> => {
  const response = await axios.get<SupabaseUser[]>(`/api/node/users`);
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
