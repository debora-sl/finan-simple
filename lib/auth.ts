import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/prisma";
import { handleAdminDeparture } from "@/data/households";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation/password-policy";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          const invitations = await prisma.invitation.findMany({
            where: { email: user.email.toLowerCase(), status: "PENDING" },
          });

          if (invitations.length === 0) {
            return;
          }

          await prisma.$transaction(async (tx) => {
            for (const invitation of invitations) {
              await tx.membership.upsert({
                where: {
                  userId_householdId: { userId: user.id, householdId: invitation.householdId },
                },
                create: { userId: user.id, householdId: invitation.householdId, role: "MEMBER" },
                update: {},
              });

              await tx.invitation.update({
                where: { id: invitation.id },
                data: { status: "ACCEPTED" },
              });
            }

            const currentUser = await tx.user.findUniqueOrThrow({
              where: { id: user.id },
              select: { activeHouseholdId: true },
            });

            if (!currentUser.activeHouseholdId) {
              await tx.user.update({
                where: { id: user.id },
                data: { activeHouseholdId: invitations[0].householdId },
              });
            }
          });
        },
      },
      delete: {
        async before(user) {
          const memberships = await prisma.membership.findMany({
            where: { userId: user.id },
            select: { householdId: true },
          });

          for (const membership of memberships) {
            await handleAdminDeparture(membership.householdId, user.id);
          }

          await prisma.invitation.deleteMany({
            where: { invitedById: user.id, status: "PENDING" },
          });
        },
      },
    },
  },
  plugins: [nextCookies()],
});
