import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandLogo } from "@/components/layout/BrandLogo";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Shield,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-sky-100/70 bg-gradient-to-b from-sky-50 via-white to-sky-100/60">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.20),transparent_42%),radial-gradient(circle_at_84%_30%,rgba(14,165,233,0.15),transparent_36%)]" />

          <div className="container relative mx-auto max-w-7xl px-4 pb-8 pt-10 md:pb-10 md:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-sky-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Marketplace acadêmico
                </div>

                <div className="space-y-4">
                  <BrandLogo withText logoClassName="h-10 w-10 md:h-11 md:w-11" textClassName="text-3xl md:text-4xl" />

                  <h1 className="max-w-xl text-4xl font-extrabold leading-[1.02] tracking-tight text-slate-900 md:text-6xl">
                    Negocie materiais odontológicos com confiança.
                  </h1>

                  <p className="max-w-xl text-lg leading-relaxed text-slate-600 md:text-2xl">
                    O odontológicotológicotoTrade conecta estudantes da <span className="font-bold text-slate-900">UNIFIO</span> para
                    comprar e vender materiais odontológicos com segurança, agilidade e os melhores preços.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/anuncios">
                    <Button size="lg" className="h-12 rounded-xl px-6 text-base shadow-lg shadow-sky-500/25">
                      Explorar anúncios
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/registro">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 rounded-xl border-slate-300 bg-white/90 px-6 text-base text-slate-800"
                    >
                      Criar minha conta
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-[2rem] border border-sky-100/80 bg-white/70 p-4 shadow-[0_24px_70px_-30px_rgba(2,132,199,0.55)] backdrop-blur-sm md:p-6">
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-sky-100 bg-white/90 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-900">
                      <BrandLogo withText logoClassName="h-6 w-6" textClassName="text-base" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">Prévia da plataforma</span>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <article key={item} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 rounded-2xl border border-sky-100 bg-white p-3 md:grid-cols-[120px_1fr_auto]">
                        <div className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-sky-50 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-600 md:text-xs">
                          IMG {item}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Item odontológico</p>
                          <p className="text-xs text-slate-500 md:text-sm">Espaço para nome, resumo e preço do anúncio</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">&lt; 2 min</span>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="absolute -right-2 -top-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-100 bg-white/95 shadow-md md:-right-5 md:-top-6 md:h-20 md:w-20">
                  <span className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-600 md:text-xs">IMG
                    BADGE</span>
                </div>

                <div className="absolute -bottom-4 left-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-100 bg-white/95 shadow-md md:-bottom-6 md:left-8 md:h-24 md:w-24">
                  <span className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-600 md:text-xs">IMG
                    PROD</span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-[0_16px_50px_-30px_rgba(14,116,144,0.5)] backdrop-blur-sm md:grid-cols-3 md:gap-0 md:p-6">
              <div className="flex items-center gap-3 px-2 md:px-4">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <Clock3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold leading-none text-slate-900">&lt; 2 min</p>
                  <p className="mt-1 text-slate-600">Anúncio rápido</p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-sky-100 px-2 md:border-x md:px-6">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <BrandLogo withText={false} logoClassName="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold italic leading-none text-sky-700">Unifio</p>
                  <p className="mt-1 text-slate-600">Marketplace acadêmico</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 md:px-6">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-semibold leading-tight text-slate-900 md:text-4xl md:leading-none">Segurança e agilidade</p>
                  <Link href="/anuncios" className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-sky-700 hover:text-sky-600 md:text-lg">
                    Ver materiais disponíveis
                    <Sparkles className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
