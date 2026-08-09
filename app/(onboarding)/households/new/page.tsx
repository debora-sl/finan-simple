import { HouseholdForm } from "@/components/households/household-form";

export default function NewHouseholdPage() {
  return (
    <div className="mx-auto flex w-full max-w-[26rem] flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Criar residência
        </h1>
        <p className="text-sm text-muted-foreground">
          Crie uma residência para organizar despesas e categorias.
        </p>
      </div>
      <HouseholdForm />
    </div>
  );
}
