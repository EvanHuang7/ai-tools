import type { AxiosInstance } from "axios";
import type { SupabaseUser } from "@/types/api";

export const supabasePostgreRead = async (
  axios: AxiosInstance
): Promise<SupabaseUser[]> => {
  const response = await axios.get<SupabaseUser[]>(`/api/node/users`);
  return response.data;
};

export const supabasePostgreWrite = async (
  name: string,
  email: string,
  axios: AxiosInstance
) => {
  return axios.post("/api/node/users", { name, email });
};
