export function AppHeader({
  name,
  menuTrigger,
}: {
  name: string;
  menuTrigger?: React.ReactNode;
}) {
  const trimmedName = name.trim();

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:px-8">
      {menuTrigger}
      <p className="text-sm font-medium text-foreground">
        {trimmedName ? `Olá, ${trimmedName}` : "Olá!"}
      </p>
    </header>
  );
}
