"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { X } from "lucide-react";

import { cancelInvitation } from "@/actions/cancel-invitation";
import { useActionErrorHandler } from "@/lib/action-error";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type Invitation = {
  id: string;
  email: string;
  status: InvitationStatus;
  createdAt: Date;
};

const statusLabels: Record<InvitationStatus, string> = {
  PENDING: "Enviado",
  ACCEPTED: "Aceito",
  REJECTED: "Recusado",
};

const statusVariants: Record<InvitationStatus, "secondary" | "default" | "destructive"> = {
  PENDING: "secondary",
  ACCEPTED: "default",
  REJECTED: "destructive",
};

export function InvitationsList({ invitations }: { invitations: Invitation[] }) {
  const { execute: cancel } = useAction(cancelInvitation, {
    onSuccess: () => toast.success("Convite cancelado."),
    onError: useActionErrorHandler("Não foi possível cancelar o convite."),
  });

  if (invitations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum convite.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>E-mail</TableHead>
          <TableHead>Enviado em</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell className="font-medium text-foreground">
              {invitation.email}
            </TableCell>
            <TableCell>{dateFormatter.format(new Date(invitation.createdAt))}</TableCell>
            <TableCell>
              <Badge variant={statusVariants[invitation.status]}>
                {statusLabels[invitation.status]}
              </Badge>
            </TableCell>
            <TableCell>
              {invitation.status === "PENDING" && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Cancelar convite"
                  onClick={() => cancel({ invitationId: invitation.id })}
                >
                  <X />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
