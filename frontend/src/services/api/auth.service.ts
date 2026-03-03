import { apiPost, apiGet } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, UserMe } from "@/types/api";

export async function register(body: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await apiPost<ApiResponse<AuthResponse>>("/auth/register", body);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function login(body: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await apiPost<ApiResponse<AuthResponse>>("/auth/login", body);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function getMe(token: string): Promise<UserMe> {
  const res = await apiGet<ApiResponse<UserMe>>("/users/me", token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}
