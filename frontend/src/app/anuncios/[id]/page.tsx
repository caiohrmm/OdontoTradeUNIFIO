"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getListingById } from "@/services/api/listings.service";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package2 } from "lucide-react";
import Image from "next/image";

export default function AnuncioDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id),
    enabled: !!id,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Link href="/anuncios" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
            ← Voltar aos anúncios
          </Link>
          {isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {error && (
            <p className="text-destructive">Anúncio não encontrado ou erro ao carregar.</p>
          )}
          {data && (
            <Card>
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  {data.imageUrls?.[0] ? (
                    <Image
                      src={data.imageUrls[0]}
                      alt={data.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package2 className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{data.status}</span>
                  <h1 className="mt-1 text-2xl font-bold">{data.title}</h1>
                  <p className="mt-2 text-muted-foreground">Por {data.sellerName}</p>
                  {data.price != null && (
                    <p className="mt-4 text-2xl font-semibold text-primary">
                      R$ {data.price.toFixed(2)}
                    </p>
                  )}
                  {data.description && (
                    <p className="mt-6 whitespace-pre-wrap text-sm">{data.description}</p>
                  )}
                  <Button className="mt-6">Contatar vendedor</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
