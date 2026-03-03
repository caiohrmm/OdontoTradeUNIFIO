/**
 * Cliente HTTP base para a API OdontoTrade.
 * Base URL via NEXT_PUBLIC_API_BASE_URL (default: http://localhost:8080/api/v1)
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export type ApiError = {
  status: "error";
  message?: string;
  data?: Record<string, unknown>;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err?.message ?? `Erro ${res.status}`);
  }
  return data as T;
}

export function getApiBase(): string {
  return API_BASE;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers, cache: "no-store" });
  return handleResponse<T>(res);
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string, token?: string): Promise<T> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE", headers });
  return handleResponse<T>(res);
}
