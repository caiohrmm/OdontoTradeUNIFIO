import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Category } from "@/types/api";

export async function getCategories(token?: string): Promise<Category[]> {
  const res = await apiGet<ApiResponse<Category[]>>("/categories", token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function getCategoryById(
  id: string,
  token?: string
): Promise<Category> {
  const res = await apiGet<ApiResponse<Category>>(`/categories/${id}`, token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function createCategory(
  body: { name: string; slug?: string; description?: string },
  token: string
): Promise<Category> {
  const res = await apiPost<ApiResponse<Category>>("/categories", body, token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function updateCategory(
  id: string,
  body: Partial<{ name: string; slug: string; description: string }>,
  token: string
): Promise<Category> {
  const res = await apiPut<ApiResponse<Category>>(`/categories/${id}`, body, token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function deleteCategory(id: string, token: string): Promise<void> {
  await apiDelete<ApiResponse<unknown>>(`/categories/${id}`, token);
}
