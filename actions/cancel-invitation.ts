"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { invitationIdSchema } from "@/lib/validation/invitation";
import { getMembership } from "@/data/households";

export const cancelInvitation = protectedActionClient
  .inputSchema(invitationIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const invitation = await prisma.invitation.findUnique({
      where: { id: parsedInput.invitationId },
    });

    if (!invitation) {
      throw new Error("Convite não encontrado.");
    }

    const membership = await getMembership(ctx.user.id, invitation.householdId);

    if (membership?.role !== "ADMIN") {
      throw new Error("Apenas o Administrador pode cancelar convites.");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("Esse convite não está mais pendente.");
    }

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/households");
  });
