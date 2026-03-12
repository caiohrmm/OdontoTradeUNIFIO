import { getApiBase } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

type UploadResponse = {
  url: string;
};

export async function uploadListingImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${getApiBase()}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as ApiResponse<UploadResponse>;
  if (!res.ok) {
    throw new Error(data?.message ?? `Erro ${res.status} ao enviar imagem`);
  }
  if (!data?.data?.url) {
    throw new Error("Resposta invalida ao enviar imagem");
  }
  return data.data.url;
}
