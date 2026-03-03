"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/services/api/auth.service";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const auth = await login(data);
      if (auth.token) {
        localStorage.setItem("token", auth.token);
        router.push("/anuncios");
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao entrar. Use o e-mail institucional @unifio.edu.br.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Use seu e-mail institucional @unifio.edu.br
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium">E-mail</label>
                <Input
                  type="email"
                  placeholder="seu@unifio.edu.br"
                  {...registerField("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  {...registerField("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link href="/registro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
