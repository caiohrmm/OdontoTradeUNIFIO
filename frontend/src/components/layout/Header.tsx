import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">OdontoTrade</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Início
            </Button>
          </Link>
          <Link href="/anuncios">
            <Button variant="ghost" size="sm">
              Anúncios
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Cadastrar</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
