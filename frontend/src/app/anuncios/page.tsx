"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Package2,
  Search,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useListings } from "@/hooks/use-listings";
import { useCategories } from "@/hooks/use-categories";
import { useAuth } from "@/hooks/use-auth";
import type { ListingStatus } from "@/types/api";

const PAGE_SIZE = 12;

const statusOptions: Array<{ value: "" | ListingStatus; label: string }> = [
  { value: "", label: "Todos os status" },
  { value: "ACTIVE", label: "Ativo" },
  { value: "RESERVED", label: "Reservado" },
  { value: "SOLD", label: "Vendido" },
];

function formatCurrency(value?: number) {
  if (value == null) return "A combinar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function statusLabel(status: string) {
  if (status === "ACTIVE") return "Ativo";
  if (status === "RESERVED") return "Reservado";
  if (status === "SOLD") return "Vendido";
  return status;
}

function statusClassName(status: string) {
  if (status === "ACTIVE") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "RESERVED") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "SOLD") return "border-slate-200 bg-slate-100 text-slate-600";
  return "border-slate-200 bg-slate-100 text-slate-600";
}

export default function AnunciosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get("page") ?? "0") || 0, 0);
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const status = searchParams.get("status") ?? "";

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const listingsQuery = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      search: search || undefined,
      categoryId: categoryId || undefined,
      status: status || undefined,
    }),
    [page, search, categoryId, status]
  );

  const { data, isLoading, isFetching, error } = useListings(listingsQuery);
  const { data: categories } = useCategories();
  const { isAuthenticated } = useAuth();

  const updateQuery = (updates: Record<string, string | undefined>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString());

    if (resetPage) params.set("page", "0");

    Object.entries(updates).forEach(([key, value]) => {
      if (value == null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const totalPages = data?.totalPages ?? 0;
  const canGoPrev = page > 0;
  const canGoNext = page + 1 < totalPages;

  const visiblePages = useMemo(() => {
    if (!totalPages) return [] as number[];
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    const pages: number[] = [];
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-sky-50/70 via-white to-slate-50/60">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="mb-6 rounded-3xl border border-sky-100 bg-white/85 p-5 shadow-[0_18px_50px_-35px_rgba(2,132,199,0.5)] backdrop-blur-sm md:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Anúncios</h1>
                  <p className="mt-1 text-sm text-slate-600 md:text-base">
                    Explore materiais odontológicos publicados por estudantes da UNIFIO.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/anuncios" className="text-sm font-semibold text-sky-700 hover:text-sky-600">
                    Atualizar listagem
                  </Link>
                  <Link
                    href={isAuthenticated ? "/anuncios/novo" : `/login?next=${encodeURIComponent("/anuncios/novo")}`}
                  >
                    <Button size="sm" className="rounded-xl">
                      Publicar anúncio
                    </Button>
                  </Link>
                </div>
              </div>

              <form
                className="grid gap-3 md:grid-cols-[1fr_220px_200px_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  updateQuery({ search: searchInput }, true);
                }}
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Buscar por título ou descrição"
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10"
                  />
                </div>

                <select
                  value={categoryId}
                  onChange={(event) => updateQuery({ categoryId: event.target.value }, true)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Todas as categorias</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={(event) => updateQuery({ status: event.target.value }, true)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {statusOptions.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <Button type="submit" className="h-11 rounded-xl px-4">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={() => {
                      setSearchInput("");
                      router.push(pathname);
                    }}
                  >
                    Limpar
                  </Button>
                </div>
              </form>
            </div>
          </section>

          <section className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-slate-600">
              {isLoading ? "Carregando anúncios..." : `${data?.totalElements ?? 0} anúncio(s) encontrado(s)`}
            </p>
            {isFetching && !isLoading ? (
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                Atualizando resultados...
              </span>
            ) : null}
          </section>

          {error ? (
            <Card className="rounded-2xl border-rose-200 bg-rose-50/70">
              <CardContent className="p-6 text-rose-700">
                N?o foi poss?vel carregar os anúncios. Verifique se o backend est? ativo e tente novamente.
              </CardContent>
            </Card>
          ) : null}

          {!error ? (
            <>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <Card key={index} className="overflow-hidden rounded-2xl border-slate-200">
                      <div className="aspect-[16/10] animate-pulse bg-slate-200" />
                      <CardContent className="space-y-2 p-4">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                        <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}

              {!isLoading && data?.content.length === 0 ? (
                <Card className="rounded-2xl border-slate-200 bg-white">
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <Package2 className="h-12 w-12 text-slate-400" />
                    <h2 className="mt-4 text-xl font-semibold text-slate-900">Nenhum anúncio encontrado</h2>
                    <p className="mt-2 max-w-md text-sm text-slate-600">
                      Ajuste os filtros ou limpe a busca para visualizar mais resultados.
                    </p>
                    <Button className="mt-5" onClick={() => router.push(pathname)}>
                      Ver todos os anúncios
                    </Button>
                  </CardContent>
                </Card>
              ) : null}

              {!isLoading && data?.content.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {data.content.map((item) => (
                    <Card
                      key={item.id}
                      className="group overflow-hidden rounded-2xl border-slate-200 bg-white/95 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_42px_-30px_rgba(15,23,42,0.45)]"
                    >
                      <div className="relative aspect-[16/10] bg-slate-100">
                        {item.imageUrls?.[0] ? (
                          <Image
                            src={item.imageUrls[0]}
                            alt={item.title}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                            <Package2 className="h-12 w-12" />
                          </div>
                        )}

                        <span
                          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClassName(item.status)}`}
                        >
                          {statusLabel(item.status)}
                        </span>
                      </div>

                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-900">{item.title}</h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Tag className="h-3.5 w-3.5" />
                          <span>{item.categoryName || "Sem categoria"}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-500">Por {item.sellerName}</p>
                          <p className="text-lg font-bold text-slate-900">{formatCurrency(item.price)}</p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Link href={`/anuncios/${item.id}`} className="w-full">
                          <Button variant="outline" className="w-full rounded-xl">
                            Ver detalhes
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : null}

              {!isLoading && totalPages > 1 ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canGoPrev}
                    onClick={() => updateQuery({ page: String(page - 1) })}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Anterior
                  </Button>

                  {visiblePages.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      size="sm"
                      variant={pageNumber === page ? "secondary" : "outline"}
                      className={pageNumber === page ? "font-semibold text-primary" : ""}
                      onClick={() => updateQuery({ page: String(pageNumber) })}
                    >
                      {pageNumber + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canGoNext}
                    onClick={() => updateQuery({ page: String(page + 1) })}
                  >
                    Pr?xima
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
