"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";

export default function CategoriasPage() {
  const { data, isLoading, error } = useCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">Categorias</h1>
          {isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {error && (
            <p className="text-destructive">Erro ao carregar categorias.</p>
          )}
          {data && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((cat) => (
                <Card key={cat.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{cat.name}</h3>
                    {cat.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {data?.length === 0 && !isLoading && (
            <p className="text-muted-foreground">Nenhuma categoria cadastrada.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
