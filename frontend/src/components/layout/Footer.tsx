import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <BrandLogo withText logoClassName="h-7 w-7" />
            <p className="text-sm text-muted-foreground">
              UNIFIO Centro Universit?rio de Ourinhos
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/anuncios" className="text-muted-foreground hover:text-foreground">
              An?ncios
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
