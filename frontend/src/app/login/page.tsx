"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { login } from "@/services/api/auth.service";
import { setAuthToken } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("E-mail inv?lido"),
  password: z.string().min(1, "Senha obrigat?ria"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const nextRoute = searchParams.get("next") || "/anuncios";

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: FormData) {
    try {
      const auth = await login(data);
      if (auth.token) {
        setAuthToken(auth.token);
        toast({
          variant: "success",
          title: "Login realizado",
          description: "Voc? foi autenticado com sucesso.",
        });
        router.push(nextRoute);
        router.refresh();
        return;
      }

      toast({
        variant: "error",
        title: "Falha no login",
        description: "N?o foi poss?vel autenticar com os dados enviados.",
      });
    } catch (e) {
      toast({
        variant: "error",
        title: "Erro ao entrar",
        description:
          e instanceof Error
            ? e.message
            : "Use o e-mail institucional @unifio.edu.br para acessar.",
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center bg-gradient-to-b from-sky-50 via-white to-sky-100/40 px-4 py-10">
        <div className="container mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden rounded-3xl border border-sky-100 bg-white/70 p-8 shadow-[0_20px_60px_-34px_rgba(2,132,199,0.55)] backdrop-blur-sm lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-sky-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Acesso seguro
                </span>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900">
                  Bem-vindo de volta ao OdontoTrade
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  Entre para acompanhar an?ncios, negociar com colegas e publicar materiais em poucos minutos.
                </p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-white/80 p-4">
                <p className="text-sm font-semibold text-slate-900">Dica</p>
                <p className="mt-1 text-sm text-slate-600">
                  Use seu e-mail institucional para manter o ambiente da comunidade confi?vel.
                </p>
              </div>
            </div>
          </section>

          <Card className="w-full rounded-3xl border-sky-100 bg-white/90 shadow-[0_24px_60px_-40px_rgba(2,132,199,0.6)]">
            <CardHeader className="space-y-2 pb-3">
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Entrar</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Acesse com seu e-mail institucional @unifio.edu.br
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">E-mail</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="seu@unifio.edu.br"
                      autoComplete="email"
                      className="h-11 rounded-xl border-slate-200 bg-white pl-10"
                      {...registerField("email")}
                    />
                  </div>
                  {errors.email ? (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Senha</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-11"
                      {...registerField("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                  ) : null}
                </div>

                <Button type="submit" className="h-11 w-full rounded-xl text-base font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-600">
                N?o tem conta?{" "}
                <Link
                  href={`/registro?next=${encodeURIComponent(nextRoute)}`}
                  className="font-semibold text-primary hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
