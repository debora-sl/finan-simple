export function AppHeader({
  name,
  householdName,
  menuTrigger,
}: {
  name: string;
  householdName?: string | null;
  menuTrigger?: React.ReactNode;
}) {
  const trimmedName = name.trim();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-8">
      <div className="flex items-center gap-3">
        {menuTrigger}
        <p className="text-sm font-medium text-foreground">
          {trimmedName ? `Olá, ${trimmedName}` : "Olá!"}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{householdName || "Nenhuma residência"}</p>
    </header>
  );
}
