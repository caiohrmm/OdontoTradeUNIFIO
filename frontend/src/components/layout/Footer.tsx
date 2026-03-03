import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            OdontoTrade — UNIFIO Centro Universitário de Ourinhos
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/anuncios" className="text-muted-foreground hover:text-foreground">
              Anúncios
            </Link>
            <Link href="/categorias" className="text-muted-foreground hover:text-foreground">
              Categorias
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
