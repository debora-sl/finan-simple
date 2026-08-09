"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { inviteMemberSchema } from "@/lib/validation/invitation";
import { getActiveHousehold } from "@/lib/active-household";

export const inviteMember = protectedActionClient
  .inputSchema(inviteMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { householdId, role } = await getActiveHousehold();

    if (role !== "ADMIN") {
      throw new Error("Apenas o Administrador pode convidar membros.");
    }

    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.user.id },
      select: { email: true },
    });

    if (currentUser.email.toLowerCase() === parsedInput.email) {
      throw new Error("Você não pode convidar seu próprio e-mail.");
    }

    const invitedUser = await prisma.user.findUnique({
      where: { email: parsedInput.email },
    });

    if (invitedUser) {
      const membership = await prisma.membership.findUnique({
        where: { userId_householdId: { userId: invitedUser.id, householdId } },
      });

      if (membership) {
        throw new Error("Esse e-mail já pertence a um membro da residência.");
      }
    }

    const existingInvitation = await prisma.invitation.findUnique({
      where: { householdId_email: { householdId, email: parsedInput.email } },
    });

    if (existingInvitation?.status === "PENDING") {
      throw new Error("Já existe um convite pendente para esse e-mail.");
    }

    await prisma.invitation.upsert({
      where: { householdId_email: { householdId, email: parsedInput.email } },
      create: { householdId, email: parsedInput.email },
      update: { status: "PENDING" },
    });

    revalidatePath("/households");
  });
