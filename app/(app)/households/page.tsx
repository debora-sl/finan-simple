import { getActiveHousehold } from "@/lib/active-household";
import { getCurrentUser } from "@/lib/dal";
import { getHouseholdById } from "@/data/households";
import {
  getMembers,
  getPendingInvitations,
  getPendingInvitationsForEmail,
} from "@/data/memberships";
import { IncomingInvitations } from "@/components/households/incoming-invitations";
import { InviteForm } from "@/components/households/invite-form";
import { MembersTable } from "@/components/households/members-table";
import { InvitationsList } from "@/components/households/invitations-list";
import { HouseholdNameForm } from "@/components/households/household-name-form";
import { LeaveHouseholdButton } from "@/components/households/leave-household-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HouseholdsPage() {
  const { userId, householdId, role } = await getActiveHousehold();
  const currentUser = await getCurrentUser();

  const [household, members, pendingInvitations, incomingInvitations] = await Promise.all([
    getHouseholdById(householdId),
    getMembers(householdId),
    getPendingInvitations(householdId),
    getPendingInvitationsForEmail(currentUser.email),
  ]);

  const isAdmin = role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {household?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os membros e convites da sua residência.
        </p>
      </div>

      <IncomingInvitations invitations={incomingInvitations} />

      {isAdmin && household && (
        <Card>
          <CardHeader>
            <CardTitle>Nome da residência</CardTitle>
          </CardHeader>
          <CardContent>
            <HouseholdNameForm id={household.id} name={household.name} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Membros</CardTitle>
        </CardHeader>
        <CardContent>
          <MembersTable members={members} currentUserId={userId} isAdmin={isAdmin} />
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Convidar membro</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteForm />
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Convites pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <InvitationsList invitations={pendingInvitations} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sair da residência</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveHouseholdButton householdId={householdId} />
        </CardContent>
      </Card>
    </div>
  );
}
