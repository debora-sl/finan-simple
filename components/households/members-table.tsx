"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { UserMinus } from "lucide-react";

import { removeMember } from "@/actions/remove-member";
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

type Member = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

export function MembersTable({
  members,
  currentUserId,
  isAdmin,
}: {
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const { execute: remove } = useAction(removeMember, {
    onSuccess: () => toast.success("Membro removido."),
    onError: useActionErrorHandler("Não foi possível remover o membro."),
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Papel</TableHead>
          {isAdmin && <TableHead className="w-0" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.membershipId}>
            <TableCell className="font-medium text-foreground">{member.name}</TableCell>
            <TableCell className="text-muted-foreground">{member.email}</TableCell>
            <TableCell>
              <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                {member.role === "ADMIN" ? "Administrador" : "Membro"}
              </Badge>
            </TableCell>
            {isAdmin && (
              <TableCell>
                {member.userId !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remover membro"
                    onClick={() => remove({ membershipId: member.membershipId })}
                  >
                    <UserMinus />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
