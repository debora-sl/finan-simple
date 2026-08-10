import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-muted/50 p-4">
      <Card className="w-full max-w-[26rem]">
        <CardHeader>
          <CardTitle className="text-xl">Controle Financeiro</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      <Button variant="link" nativeButton={false} render={<Link href="/" />}>
        <ArrowLeft />
        Voltar para a página inicial
      </Button>
    </div>
  );
}
