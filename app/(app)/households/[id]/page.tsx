import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/dal";
import { getHouseholdForUserWithRole } from "@/data/households";
import { getHouseholdInvitations, getMembers } from "@/data/memberships";
import { InviteForm } from "@/components/households/invite-form";
import { MembersTable } from "@/components/households/members-table";
import { InvitationsList } from "@/components/households/invitations-list";
import { HouseholdNameForm } from "@/components/households/household-name-form";
import { LeaveHouseholdButton } from "@/components/households/leave-household-button";
import { DeleteHouseholdButton } from "@/components/households/delete-household-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HouseholdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const household = await getHouseholdForUserWithRole(currentUser.id, id);

  if (!household) {
    notFound();
  }

  const [members, invitations] = await Promise.all([
    getMembers(id),
    getHouseholdInvitations(id),
  ]);

  const isAdmin = household.role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {household.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os membros e convites desta residência.
        </p>
      </div>

      {isAdmin && (
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
          <MembersTable members={members} currentUserId={currentUser.id} isAdmin={isAdmin} />
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Convidar membro</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteForm householdId={household.id} />
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Convites</CardTitle>
          </CardHeader>
          <CardContent>
            <InvitationsList invitations={invitations} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sair da residência</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveHouseholdButton householdId={household.id} />
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Zona de perigo</CardTitle>
          </CardHeader>
          <CardContent>
            <DeleteHouseholdButton householdId={household.id} householdName={household.name} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
