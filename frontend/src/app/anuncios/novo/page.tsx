"use client";

import { useMemo } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Lock, PlusCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ListingImageUploader } from "@/components/listings/ListingImageUploader";
import { useCategories } from "@/hooks/use-categories";
import { useAuth } from "@/hooks/use-auth";
import { createListing } from "@/services/api/listings.service";

const schema = z.object({
  title: z.string().min(3, "T?tulo deve ter ao menos 3 caracteres").max(255, "T?tulo muito longo"),
  description: z.string().max(10000, "Descri??o muito longa").optional().or(z.literal("")),
  price: z
    .string()
    .optional()
    .refine((value) => !value || Number(value.replace(",", ".")) >= 0, "Pre?o inv?lido"),
  categoryId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NovoAnuncioPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const { token, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const { data: categories } = useCategories();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
    },
  });

  const loginHref = useMemo(
    () => `/login?next=${encodeURIComponent(pathname || "/anuncios/novo")}`,
    [pathname]
  );

  async function onSubmit(data: FormData) {
    if (!token) {
      toast({
        variant: "error",
        title: "Autentica??o necess?ria",
        description: "Entre na sua conta para publicar an?ncios.",
      });
      router.push(loginHref);
      return;
    }

    try {
      const created = await createListing(
        {
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          price: data.price ? Number(data.price.replace(",", ".")) : undefined,
          categoryId: data.categoryId || undefined,
          imageUrls,
        },
        token
      );

      toast({
        variant: "success",
        title: "An?ncio criado",
        description: "Seu an?ncio foi publicado com sucesso.",
      });
      router.push(`/anuncios/${created.id}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "error",
        title: "Erro ao criar an?ncio",
        description: error instanceof Error ? error.message : "N?o foi poss?vel publicar o an?ncio.",
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-sky-50/70 via-white to-slate-50/60">
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-10">
          <Link href="/anuncios" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Voltar para an?ncios
          </Link>

          {!isLoadingAuth && !isAuthenticated ? (
            <Card className="rounded-2xl border-amber-200 bg-amber-50/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Lock className="h-5 w-5" />
                  Autentica??o necess?ria
                </CardTitle>
                <CardDescription className="text-amber-800">
                  Somente usu?rios autenticados podem criar, editar ou excluir an?ncios.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Link href={loginHref}>
                  <Button>Entrar para continuar</Button>
                </Link>
                <Link href={`/registro?next=${encodeURIComponent(pathname || "/anuncios/novo")}`}>
                  <Button variant="outline">Criar conta</Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}

          {isAuthenticated ? (
            <Card className="rounded-3xl border-sky-100 bg-white/90 shadow-[0_24px_60px_-40px_rgba(2,132,199,0.5)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 md:text-3xl">
                  <PlusCircle className="h-6 w-6 text-primary" />
                  Criar novo an?ncio
                </CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para publicar seu material odontol?gico.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">T?tulo</label>
                    <Input
                      placeholder="Ex.: Kit de Endodontia completo"
                      className="h-11 rounded-xl"
                      {...register("title")}
                    />
                    {errors.title ? <p className="mt-1 text-sm text-destructive">{errors.title.message}</p> : null}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Descri??o</label>
                    <textarea
                      rows={4}
                      placeholder="Descreva o estado, marca e detalhes importantes"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register("description")}
                    />
                    {errors.description ? (
                      <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">Pre?o (R$)</label>
                      <Input placeholder="Ex.: 120.00" className="h-11 rounded-xl" {...register("price")} />
                      {errors.price ? <p className="mt-1 text-sm text-destructive">{errors.price.message}</p> : null}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">Categoria</label>
                      <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...register("categoryId")}
                      >
                        <option value="">Sem categoria</option>
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Imagens</label>
                    <ListingImageUploader token={token} value={imageUrls} onChange={setImageUrls} />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <Link href="/anuncios">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? "Publicando..." : "Publicar an?ncio"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
