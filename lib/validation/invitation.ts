import { z } from "zod";

export const inviteMemberSchema = z.object({
  householdId: z.string().min(1),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido")),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const invitationIdSchema = z.object({
  invitationId: z.string().min(1),
});

export const removeMemberSchema = z.object({
  membershipId: z.string().min(1),
});
