"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit3,
  Lock,
  Package2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { ListingImageUploader } from "@/components/listings/ListingImageUploader";
import { useAuth } from "@/hooks/use-auth";
import { useCategories } from "@/hooks/use-categories";
import {
  deleteListing,
  getListingById,
  updateListing,
} from "@/services/api/listings.service";
import type { ListingStatus } from "@/types/api";

type EditForm = {
  title: string;
  description: string;
  price: string;
  categoryId: string;
  status: ListingStatus;
  imageUrls: string[];
};

function formatCurrency(value?: number) {
  if (value == null) return "A combinar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function AnuncioDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { token, user, isAuthenticated } = useAuth();
  const { data: categories } = useCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    status: "ACTIVE",
    imageUrls: [],
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      title: data.title ?? "",
      description: data.description ?? "",
      price: data.price != null ? String(data.price) : "",
      categoryId: data.categoryId ?? "",
      status: (data.status as ListingStatus) ?? "ACTIVE",
      imageUrls: data.imageUrls ?? [],
    });
  }, [data]);

  const isOwner = useMemo(
    () => Boolean(user?.id && data?.sellerId && user.id === data.sellerId),
    [user?.id, data?.sellerId]
  );

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!token || !data) throw new Error("Autentica??o necess?ria.");
      return updateListing(
        data.id,
        {
          title: form.title.trim() || undefined,
          description: form.description.trim() || undefined,
          price: form.price ? Number(form.price.replace(",", ".")) : undefined,
          categoryId: form.categoryId || undefined,
          status: form.status,
          imageUrls: form.imageUrls,
        },
        token
      );
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["listing", id], updated);
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      setIsEditing(false);
      toast({
        variant: "success",
        title: "An?ncio atualizado",
        description: "As altera??es foram salvas com sucesso.",
      });
    },
    onError: (mutationError) => {
      toast({
        variant: "error",
        title: "Erro ao atualizar",
        description: mutationError instanceof Error ? mutationError.message : "Falha ao atualizar an?ncio.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!token || !data) throw new Error("Autentica??o necess?ria.");
      await deleteListing(data.id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast({
        variant: "success",
        title: "An?ncio exclu?do",
        description: "O an?ncio foi removido com sucesso.",
      });
      router.push("/anuncios");
      router.refresh();
    },
    onError: (mutationError) => {
      toast({
        variant: "error",
        title: "Erro ao excluir",
        description: mutationError instanceof Error ? mutationError.message : "Falha ao excluir an?ncio.",
      });
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este an?ncio?");
    if (!confirmed) return;
    deleteMutation.mutate();
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      toast({
        variant: "error",
        title: "Login necess?rio",
        description: "Entre para interagir com an?ncios.",
      });
      router.push(`/login?next=${encodeURIComponent(pathname || `/anuncios/${id}`)}`);
      return;
    }

    toast({
      variant: "info",
      title: "Fun??o em progresso",
      description: "O fluxo de contato direto ser? disponibilizado em breve.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-sky-50/70 via-white to-slate-50/60">
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
          <Link href="/anuncios" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos an?ncios
          </Link>

          {isLoading ? <p className="text-slate-600">Carregando an?ncio...</p> : null}

          {error ? (
            <Card className="rounded-2xl border-rose-200 bg-rose-50/70">
              <CardContent className="p-6 text-rose-700">An?ncio n?o encontrado ou erro ao carregar.</CardContent>
            </Card>
          ) : null}

          {data ? (
            <Card className="rounded-3xl border-sky-100 bg-white/95 shadow-[0_24px_60px_-40px_rgba(2,132,199,0.45)]">
              <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.1fr] md:p-6">
                <div className="space-y-3">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                    {data.imageUrls?.[0] ? (
                      <Image
                        src={data.imageUrls[0]}
                        alt={data.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <Package2 className="h-20 w-20" />
                      </div>
                    )}
                  </div>

                  {data.imageUrls?.length > 1 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {data.imageUrls.slice(1, 5).map((url) => (
                        <div key={url} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                          <Image src={url} alt={data.title} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div>
                  {!isEditing ? (
                    <>
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {data.status}
                      </span>

                      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{data.title}</h1>
                      <p className="mt-2 text-sm text-slate-500">Publicado por {data.sellerName}</p>
                      <p className="mt-4 text-3xl font-bold text-primary">{formatCurrency(data.price)}</p>

                      {data.description ? (
                        <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{data.description}</p>
                      ) : null}

                      <div className="mt-6 flex flex-wrap gap-2">
                        <Button onClick={handleContact}>Tenho interesse</Button>

                        {isOwner ? (
                          <>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                            </Button>
                          </>
                        ) : null}

                        {!isAuthenticated ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <Lock className="h-3.5 w-3.5" />
                            Login necess?rio para interagir
                          </span>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <form
                      className="space-y-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        updateMutation.mutate();
                      }}
                    >
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">T?tulo</label>
                        <input
                          value={form.title}
                          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Pre?o</label>
                          <input
                            value={form.price}
                            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                          <select
                            value={form.status}
                            onChange={(event) =>
                              setForm((current) => ({
                                ...current,
                                status: event.target.value as ListingStatus,
                              }))
                            }
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="ACTIVE">Ativo</option>
                            <option value="RESERVED">Reservado</option>
                            <option value="SOLD">Vendido</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Categoria</label>
                        <select
                          value={form.categoryId}
                          onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Sem categoria</option>
                          {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Descri??o</label>
                        <textarea
                          rows={4}
                          value={form.description}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, description: event.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Imagens</label>
                        <ListingImageUploader
                          token={token}
                          value={form.imageUrls}
                          onChange={(urls) => setForm((current) => ({ ...current, imageUrls: urls }))}
                        />
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending}>
                          <Save className="mr-2 h-4 w-4" />
                          {updateMutation.isPending ? "Salvando..." : "Salvar altera??es"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
