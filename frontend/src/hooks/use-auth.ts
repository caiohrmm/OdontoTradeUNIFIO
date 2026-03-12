"use client";

import { useMemo } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/api/auth.service";
import { AUTH_CHANGED_EVENT, getAuthToken } from "@/lib/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const syncToken = () => setToken(getAuthToken());
    syncToken();

    window.addEventListener("storage", syncToken);
    window.addEventListener(AUTH_CHANGED_EVENT, syncToken as EventListener);

    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncToken as EventListener);
    };
  }, []);

  const meQuery = useQuery({
    queryKey: ["me", token],
    queryFn: () => getMe(token as string),
    enabled: Boolean(token),
    staleTime: 60 * 1000,
  });

  return useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      user: meQuery.data ?? null,
      isLoading: Boolean(token) && meQuery.isLoading,
      isError: meQuery.isError,
    }),
    [token, meQuery.data, meQuery.isLoading, meQuery.isError]
  );
}
