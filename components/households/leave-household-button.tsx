"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

import { leaveHousehold } from "@/actions/leave-household";
import { useActionErrorHandler } from "@/lib/action-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LeaveHouseholdButton({ householdId }: { householdId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { execute, isPending } = useAction(leaveHousehold, {
    onSuccess: () => {
      toast.success("Você saiu da residência.");
      setOpen(false);
      router.push("/households");
    },
    onError: useActionErrorHandler("Não foi possível sair da residência."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        <LogOut />
        Sair da residência
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sair da residência</DialogTitle>
          <DialogDescription>
            Se você for o único integrante, a residência e todos os seus dados serão removidos. Se
            você for o Administrador, a gestão passa automaticamente ao membro mais antigo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => execute({ householdId })}
          >
            {isPending ? "Saindo..." : "Confirmar saída"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
