"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, PiggyBank, Receipt, Tag } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Despesas", icon: Receipt },
  { href: "/categories", label: "Categorias", icon: Tag },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-6 border-r border-border bg-card p-3.5">
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <PiggyBank className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-foreground">Controle</p>
          <p className="text-xs text-muted-foreground">Financeiro</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4.5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Button variant="ghost" className="justify-start gap-3 px-3" onClick={handleSignOut}>
        <LogOut className="size-4.5" />
        Sair
      </Button>
    </aside>
  );
}
