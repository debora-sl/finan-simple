import { prisma } from "@/lib/prisma";

export async function getMembers(householdId: string) {
  const memberships = await prisma.membership.findMany({
    where: { householdId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { joinedAt: "asc" },
  });

  return memberships.map((membership) => ({
    membershipId: membership.id,
    userId: membership.userId,
    name: membership.user.name,
    email: membership.user.email,
    role: membership.role as "ADMIN" | "MEMBER",
    joinedAt: membership.joinedAt,
  }));
}

export async function getHouseholdInvitations(householdId: string) {
  const invitations = await prisma.invitation.findMany({
    where: { householdId },
    orderBy: { createdAt: "desc" },
  });

  return invitations.map((invitation) => ({
    id: invitation.id,
    email: invitation.email,
    status: invitation.status as "PENDING" | "ACCEPTED" | "REJECTED",
    createdAt: invitation.createdAt,
  }));
}

export async function getPendingInvitationsForEmail(email: string) {
  const invitations = await prisma.invitation.findMany({
    where: { email: email.toLowerCase(), status: "PENDING" },
    include: {
      household: { select: { name: true } },
      invitedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return invitations.map((invitation) => ({
    id: invitation.id,
    householdId: invitation.householdId,
    householdName: invitation.household.name,
    invitedByName: invitation.invitedBy?.name ?? "um administrador",
    createdAt: invitation.createdAt,
  }));
}
