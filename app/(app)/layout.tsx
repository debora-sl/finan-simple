import { getActiveHousehold } from "@/lib/active-household";
import { getCurrentUser } from "@/lib/dal";
import { getHouseholdsForUser } from "@/data/households";
import { getPendingInvitationsForEmail } from "@/data/memberships";
import { AppSidebar, AppSidebarMobileNav } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { IncomingInvitations } from "@/components/households/incoming-invitations";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, householdId } = await getActiveHousehold();
  const currentUser = await getCurrentUser();
  const [households, incomingInvitations] = await Promise.all([
    getHouseholdsForUser(userId),
    getPendingInvitationsForEmail(currentUser.email),
  ]);

  return (
    <div className="flex flex-1">
      <AppSidebar households={households} activeHouseholdId={householdId} />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AppHeader
          name={currentUser.name}
          menuTrigger={
            <AppSidebarMobileNav households={households} activeHouseholdId={householdId} />
          }
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <IncomingInvitations invitations={incomingInvitations} />
    </div>
  );
}
