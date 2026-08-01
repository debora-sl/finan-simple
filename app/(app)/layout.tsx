import { verifySession } from "@/lib/dal";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await verifySession();

  return (
    <div className="flex flex-1">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
