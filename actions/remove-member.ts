"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { removeMemberSchema } from "@/lib/validation/invitation";
import { getMembership } from "@/data/households";

export const removeMember = protectedActionClient
  .inputSchema(removeMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const membership = await prisma.membership.findUnique({
      where: { id: parsedInput.membershipId },
    });

    if (!membership) {
      throw new Error("Membro não encontrado.");
    }

    if (membership.userId === ctx.user.id) {
      throw new Error("Use a opção de sair da residência para se remover.");
    }

    const requesterMembership = await getMembership(ctx.user.id, membership.householdId);

    if (requesterMembership?.role !== "ADMIN") {
      throw new Error("Apenas o Administrador pode remover membros.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.membership.delete({ where: { id: membership.id } });

      const removedUser = await tx.user.findUniqueOrThrow({
        where: { id: membership.userId },
        select: { activeHouseholdId: true },
      });

      if (removedUser.activeHouseholdId === membership.householdId) {
        const fallback = await tx.membership.findFirst({
          where: { userId: membership.userId },
          orderBy: { joinedAt: "asc" },
        });

        await tx.user.update({
          where: { id: membership.userId },
          data: { activeHouseholdId: fallback?.householdId ?? null },
        });
      }
    });

    revalidatePath("/households");
  });
