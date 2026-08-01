import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-[26rem]">
        <CardHeader>
          <CardTitle className="text-xl">Controle Financeiro</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
