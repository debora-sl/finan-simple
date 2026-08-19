import { getCurrentUser } from "@/lib/dal";
import { getActiveHouseholdId, getHouseholdsForUser } from "@/data/households";
import { getPendingInvitationsForEmail } from "@/data/memberships";
import { AppSidebar, AppSidebarMobileNav } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { IncomingInvitations } from "@/components/households/incoming-invitations";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const [activeHouseholdId, households, incomingInvitations] = await Promise.all([
    getActiveHouseholdId(currentUser.id),
    getHouseholdsForUser(currentUser.id),
    getPendingInvitationsForEmail(currentUser.email),
  ]);

  const activeHouseholdName =
    households.find((household) => household.id === activeHouseholdId)?.name ?? null;

  return (
    <div className="flex flex-1">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AppHeader
          name={currentUser.name}
          householdName={activeHouseholdName}
          menuTrigger={<AppSidebarMobileNav />}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <IncomingInvitations invitations={incomingInvitations} />
    </div>
  );
}
