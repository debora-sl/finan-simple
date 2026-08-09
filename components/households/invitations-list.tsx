"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { X } from "lucide-react";

import { cancelInvitation } from "@/actions/cancel-invitation";
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

type Invitation = {
  id: string;
  email: string;
  createdAt: Date;
};

export function InvitationsList({ invitations }: { invitations: Invitation[] }) {
  const { execute: cancel } = useAction(cancelInvitation, {
    onSuccess: () => toast.success("Convite cancelado."),
    onError: ({ error }) =>
      toast.error(error.serverError ?? "Não foi possível cancelar o convite."),
  });

  if (invitations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum convite pendente.</p>
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
              <Badge variant="secondary">Pendente</Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Cancelar convite"
                onClick={() => cancel({ invitationId: invitation.id })}
              >
                <X />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
