"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { invitationIdSchema } from "@/lib/validation/invitation";

export const acceptInvitation = protectedActionClient
  .inputSchema(invitationIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const invitation = await prisma.invitation.findUnique({
      where: { id: parsedInput.invitationId },
    });

    if (!invitation || invitation.status !== "PENDING") {
      throw new Error("Convite não encontrado ou não está mais pendente.");
    }

    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.user.id },
      select: { email: true, activeHouseholdId: true },
    });

    if (currentUser.email.toLowerCase() !== invitation.email) {
      throw new Error("Esse convite não pertence à sua conta.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.membership.upsert({
        where: {
          userId_householdId: { userId: ctx.user.id, householdId: invitation.householdId },
        },
        create: { userId: ctx.user.id, householdId: invitation.householdId, role: "MEMBER" },
        update: {},
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      if (!currentUser.activeHouseholdId) {
        await tx.user.update({
          where: { id: ctx.user.id },
          data: { activeHouseholdId: invitation.householdId },
        });
      }
    });

    revalidatePath("/households");
    revalidatePath("/dashboard");

    return { householdId: invitation.householdId };
  });
