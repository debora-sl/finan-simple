import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Entrar</h1>
        <p className="text-sm text-muted-foreground">
          Acesse sua conta para gerenciar suas despesas.
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
