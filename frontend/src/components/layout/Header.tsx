"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AUTH_CHANGED_EVENT, clearAuthToken, getAuthToken } from "@/lib/auth";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(getAuthToken()));

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth as EventListener);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isLogoutModalOpen) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLogoutModalOpen(false);
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isLogoutModalOpen]);

  const handleLogoutConfirm = () => {
    clearAuthToken();
    setIsLogoutModalOpen(false);
    toast({
      variant: "success",
      title: "Sess\u00E3o encerrada",
      description: "Voc\u00EA saiu da plataforma com seguran\u00E7a.",
    });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BrandLogo withText className="gap-2" logoClassName="h-7 w-7" textClassName="hidden sm:inline" />
          </Link>

          {isAuthenticated ? (
            <span className="ml-4 hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              {"Sess\u00E3o ativa"}
            </span>
          ) : null}

          <nav className="ml-auto flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/") ? "font-semibold text-primary" : ""}
                aria-current={isActive("/") ? "page" : undefined}
              >
                {"In\u00EDcio"}
              </Button>
            </Link>

            <Link href="/anuncios">
              <Button
                variant={isActive("/anuncios") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/anuncios") ? "font-semibold text-primary" : ""}
                aria-current={isActive("/anuncios") ? "page" : undefined}
              >
                {"An\u00FAncios"}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sair
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant={isActive("/login") ? "secondary" : "ghost"}
                    size="sm"
                    className={isActive("/login") ? "font-semibold text-primary" : ""}
                    aria-current={isActive("/login") ? "page" : undefined}
                  >
                    Entrar
                  </Button>
                </Link>

                <Link href="/registro">
                  <Button
                    size="sm"
                    variant={isActive("/registro") ? "secondary" : "default"}
                    className={isActive("/registro") ? "font-semibold text-primary" : ""}
                    aria-current={isActive("/registro") ? "page" : undefined}
                  >
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {isLogoutModalOpen ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{"Confirmar sa\u00EDda"}</h2>
                <p className="mt-1 text-sm text-slate-600">{"Deseja realmente encerrar sua sess\u00E3o agora?"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Fechar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsLogoutModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="gap-1.5"
                onClick={handleLogoutConfirm}
              >
                <LogOut className="h-4 w-4" />
                {"Confirmar sa\u00EDda"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
