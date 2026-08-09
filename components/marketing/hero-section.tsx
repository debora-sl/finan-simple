import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PiggyBank } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="flex flex-col gap-6">
        <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <PiggyBank className="size-5.5" />
        </span>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Controle financeiro simples para toda a família
          </h1>
          <p className="max-w-md text-base text-muted-foreground">
            Organize despesas e categorias por residência e acompanhe o que é pago e o que está
            pendente, junto com quem divide as contas com você.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" render={<Link href="/signup" />}>
            Criar conta grátis
            <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/login" />}>
            Entrar
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <Image
          src="/landing-hero.svg"
          alt="Exemplo ilustrativo de um painel de controle financeiro"
          width={480}
          height={420}
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
