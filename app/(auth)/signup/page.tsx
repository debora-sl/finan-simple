import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre-se para começar a controlar suas despesas.
        </p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
