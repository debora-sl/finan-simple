"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";

import { acceptInvitation } from "@/actions/accept-invitation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

type IncomingInvitation = {
  id: string;
  householdName: string;
  createdAt: Date;
};

export function IncomingInvitations({
  invitations,
}: {
  invitations: IncomingInvitation[];
}) {
  const router = useRouter();

  const { execute, isPending } = useAction(acceptInvitation, {
    onSuccess: () => {
      toast.success("Convite aceito.");
      router.push("/dashboard");
    },
    onError: ({ error }: { error: { serverError?: string } }) => {
      toast.error(error.serverError ?? "Não foi possível aceitar o convite.");
    },
  });

  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convites recebidos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {invitation.householdName}
              </p>
              <p className="text-sm text-muted-foreground">
                Convite enviado em {dateFormatter.format(new Date(invitation.createdAt))}
              </p>
            </div>
            <Button
              disabled={isPending}
              onClick={() => execute({ invitationId: invitation.id })}
            >
              <Check />
              Aceitar
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
