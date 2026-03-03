"use client";

import { useQuery } from "@tanstack/react-query";
import { getListings, type ListingsQuery } from "@/services/api/listings.service";

export function useListings(params: ListingsQuery = {}) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => getListings(params),
  });
}
