import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Package2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex items-center gap-3">
              <Package2 className="h-12 w-12 text-primary md:h-16 md:w-16" />
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                OdontoTrade
              </h1>
            </div>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Compre e venda materiais odontológicos entre estudantes da UNIFIO.
              Anuncie o que não usa mais e encontre o que precisa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/anuncios">
                <Button size="lg" className="gap-2">
                  Ver anúncios
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="lg" variant="outline">
                  Criar conta
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-center text-2xl font-semibold">
              Como funciona
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-center">
                <p className="font-medium">1. Cadastre-se</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use seu e-mail institucional @unifio.edu.br
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <p className="font-medium">2. Anuncie</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Publique materiais que não usa mais
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <p className="font-medium">3. Negocie</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Combine com outros alunos da faculdade
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
