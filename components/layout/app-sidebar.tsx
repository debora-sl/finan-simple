"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  Receipt,
  Tag,
  UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { HouseholdSwitcher } from "@/components/layout/household-switcher";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Despesas", icon: Receipt },
  { href: "/categories", label: "Categorias", icon: Tag },
  { href: "/households", label: "Residência", icon: Home },
];

type HouseholdSummary = { id: string; name: string; role: string };

type SidebarContentProps = {
  households: HouseholdSummary[];
  activeHouseholdId: string;
  onNavigate?: () => void;
};

function SidebarContent({ households, activeHouseholdId, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <div className="flex h-full flex-col gap-6 p-3.5">
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <PiggyBank className="size-5" />
        </span>
        <p className="text-sm font-bold text-foreground">Controle</p>
      </div>

      <HouseholdSwitcher households={households} activeHouseholdId={activeHouseholdId} />

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
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

      <div className="flex flex-col gap-1">
        <Link
          href="/profile"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname.startsWith("/profile")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
        >
          <UserRound className="size-4.5" />
          Perfil
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="flex-1 justify-start gap-3 px-3"
            onClick={handleSignOut}
          >
            <LogOut className="size-4.5" />
            Sair
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({
  households,
  activeHouseholdId,
}: {
  households: HouseholdSummary[];
  activeHouseholdId: string;
}) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:flex">
      <SidebarContent households={households} activeHouseholdId={activeHouseholdId} />
    </aside>
  );
}

export function AppSidebarMobileNav({
  households,
  activeHouseholdId,
}: {
  households: HouseholdSummary[];
  activeHouseholdId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
        <Menu className="size-5" />
        <span className="sr-only">Abrir menu de navegação</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <SidebarContent
          households={households}
          activeHouseholdId={activeHouseholdId}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
