/**
 * Tipos alinhados à API OdontoTrade (backend).
 * Substituir por geração a partir do OpenAPI quando conveniente.
 */

export type ApiResponse<T> = {
  status: string;
  timestamp?: string;
  data?: T;
  message?: string;
};

export type AuthResponse = {
  token: string;
  type: string;
  userId: string;
  email: string;
  name: string;
  role: string;
};

export type UserMe = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type ListingStatus = "ACTIVE" | "SOLD" | "RESERVED";

export type ListingSummary = {
  id: string;
  sellerId: string;
  sellerName: string;
  categoryId?: string;
  categoryName?: string;
  title: string;
  price?: number;
  status: string;
  imageUrls: string[];
  createdAt: string;
};

export type Listing = ListingSummary & {
  description?: string;
  updatedAt: string;
};

export type PagedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};
