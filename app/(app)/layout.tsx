import { getActiveHousehold } from "@/lib/active-household";
import { getHouseholdsForUser } from "@/data/households";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, householdId } = await getActiveHousehold();
  const households = await getHouseholdsForUser(userId);

  return (
    <div className="flex flex-1">
      <AppSidebar households={households} activeHouseholdId={householdId} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
