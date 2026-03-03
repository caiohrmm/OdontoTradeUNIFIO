import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Listing, ListingSummary, PagedResponse } from "@/types/api";

export type ListingsQuery = {
  status?: string;
  sellerId?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  size?: number;
};

function buildQuery(params: ListingsQuery): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : "";
}

export async function getListings(
  params: ListingsQuery = {},
  token?: string
): Promise<PagedResponse<ListingSummary>> {
  const res = await apiGet<
    ApiResponse<PagedResponse<ListingSummary>>
  >(`/listings${buildQuery(params)}`, token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function getListingById(
  id: string,
  token?: string
): Promise<Listing> {
  const res = await apiGet<ApiResponse<Listing>>(`/listings/${id}`, token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function createListing(
  body: {
    title: string;
    description?: string;
    price?: number;
    categoryId?: string;
    imageUrls?: string[];
  },
  token: string
): Promise<Listing> {
  const res = await apiPost<ApiResponse<Listing>>("/listings", body, token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function updateListing(
  id: string,
  body: Partial<{
    title: string;
    description: string;
    price: number;
    status: string;
    categoryId: string;
    imageUrls: string[];
  }>,
  token: string
): Promise<Listing> {
  const res = await apiPut<ApiResponse<Listing>>(`/listings/${id}`, body, token);
  if (!res.data) throw new Error("Resposta inválida");
  return res.data;
}

export async function deleteListing(id: string, token: string): Promise<void> {
  await apiDelete<ApiResponse<unknown>>(`/listings/${id}`, token);
}
