"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

import { acceptInvitation } from "@/actions/accept-invitation";
import { rejectInvitation } from "@/actions/reject-invitation";
import { useActionErrorHandler } from "@/lib/action-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type IncomingInvitation = {
  id: string;
  householdName: string;
  invitedByName: string;
  createdAt: Date;
};

export function IncomingInvitations({
  invitations,
}: {
  invitations: IncomingInvitation[];
}) {
  const router = useRouter();

  const { execute: accept, isPending: isAccepting } = useAction(acceptInvitation, {
    onSuccess: () => {
      toast.success("Convite aceito.");
      router.push("/dashboard");
    },
    onError: useActionErrorHandler("Não foi possível aceitar o convite."),
  });

  const { execute: reject, isPending: isRejecting } = useAction(rejectInvitation, {
    onSuccess: () => toast.success("Convite recusado."),
    onError: useActionErrorHandler("Não foi possível recusar o convite."),
  });

  const invitation = invitations[0];

  if (!invitation) {
    return null;
  }

  const isPending = isAccepting || isRejecting;

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Convite para colaborar</DialogTitle>
          <DialogDescription>
            Olá, você recebeu um convite de {invitation.invitedByName} para colaborar com o
            controle financeiro da residência: {invitation.householdName}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => reject({ invitationId: invitation.id })}
          >
            <X />
            Recusar
          </Button>
          <Button
            disabled={isPending}
            onClick={() => accept({ invitationId: invitation.id })}
          >
            <Check />
            Aceitar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
