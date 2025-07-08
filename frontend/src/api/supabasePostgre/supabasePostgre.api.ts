import { api } from "../client";
import type { SupabaseUser } from "@/types/api";

export const supabasePostgreRead = async (): Promise<SupabaseUser[]> => {
  const response = await api.get<SupabaseUser[]>(`/api/node/users`);
  return response.data;
};

export const supabasePostgreWrite = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  return api.post("/api/node/users", { name, email });
};
