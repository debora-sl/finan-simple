"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { inviteMemberSchema } from "@/lib/validation/invitation";
import { getMembership } from "@/data/households";

export const inviteMember = protectedActionClient
  .inputSchema(inviteMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { householdId } = parsedInput;
    const membership = await getMembership(ctx.user.id, householdId);

    if (membership?.role !== "ADMIN") {
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

    if (!invitedUser) {
      throw new Error(
        "Não existe uma conta com este e-mail. Peça para a pessoa se cadastrar primeiro."
      );
    }

    const invitedMembership = await prisma.membership.findUnique({
      where: { userId_householdId: { userId: invitedUser.id, householdId } },
    });

    if (invitedMembership) {
      throw new Error("Esse e-mail já pertence a um membro da residência.");
    }

    const existingInvitation = await prisma.invitation.findUnique({
      where: { householdId_email: { householdId, email: parsedInput.email } },
    });

    if (existingInvitation?.status === "PENDING") {
      throw new Error("Já existe um convite pendente para esse e-mail.");
    }

    if (existingInvitation?.status === "REJECTED") {
      throw new Error("Este e-mail recusou um convite anterior para esta residência.");
    }

    if (!existingInvitation) {
      await prisma.invitation.create({
        data: { householdId, email: parsedInput.email, invitedById: ctx.user.id },
      });
    }

    revalidatePath("/households");
    revalidatePath(`/households/${householdId}`);
  });
