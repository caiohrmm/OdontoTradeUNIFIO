"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useListings } from "@/hooks/use-listings";
import { Package2 } from "lucide-react";
import Image from "next/image";

export default function AnunciosPage() {
  const { data, isLoading, error } = useListings({ page: 0, size: 12 });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">Anúncios</h1>
          {isLoading && (
            <p className="text-muted-foreground">Carregando anúncios...</p>
          )}
          {error && (
            <p className="text-destructive">
              Erro ao carregar. Verifique se a API está rodando em{" "}
              {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"}.
            </p>
          )}
          {data && (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {data.totalElements} anúncio(s) encontrado(s)
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.content.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      {item.imageUrls?.[0] ? (
                        <Image
                          src={item.imageUrls[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package2 className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {item.status !== "ACTIVE" && (
                        <span className="absolute right-2 top-2 rounded bg-muted px-2 py-0.5 text-xs font-medium">
                          {item.status}
                        </span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.sellerName}
                      </p>
                      {item.price != null && (
                        <p className="mt-1 font-medium">
                          R$ {item.price.toFixed(2)}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/anuncios/${item.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver detalhes
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {data.content.length === 0 && (
                <p className="text-muted-foreground">
                  Nenhum anúncio ainda. Seja o primeiro a publicar!
                </p>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
